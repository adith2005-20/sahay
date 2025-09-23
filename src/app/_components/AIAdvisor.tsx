'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type AiOk = { output: string };
type AiErr = { error: string; details?: string };

type RiasecRecord = {
  id?: string;
  user_id: string;
  created_at: string;
  // Common payload locations we might store the results in
  results?: unknown;
  response_data?: unknown;
  [key: string]: unknown;
};

export default function AIAdvisor() {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [riasec, setRiasec] = useState<RiasecRecord | null>(null);
  const [prompt, setPrompt] = useState<string>(
    'Create a personalized guidance plan based on my RIASEC results.'
  );
  const [answer, setAnswer] = useState<string>('');
  const [err, setErr] = useState<string>('');

  const isObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && v !== null;

  // Very small Markdown -> HTML converter for headings, bold/italic, lists, and paragraphs.
  // Also escapes HTML first to mitigate injection.
  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const mdToHtml = (md: string) => {
    const escaped = escapeHtml(md);
    const lines = escaped.split(/\r?\n/);
    const html: string[] = [];

    let inUl = false;
    const closeUl = () => {
      if (inUl) {
        html.push('</ul>');
        inUl = false;
      }
    };

    const formatInline = (s: string) =>
      s
        // bold **text**
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // italic _text_ or *text*
        .replace(/(^|\W)_(.+?)_($|\W)/g, '$1<em>$2</em>$3')
        .replace(/\*(.+?)\*/g, '<em>$1</em>');

    for (const raw of lines) {
      const line = raw.trimEnd();
      if (!line.trim()) {
        closeUl();
        continue;
      }
      // Headings
      const h = /^(#{1,6})\s+(.*)$/.exec(line);
      if (h) {
        closeUl();
        const level = (h?.[1]?.length ?? 1);
        const hText = h?.[2] ?? '';
        html.push(`<h${level}>${formatInline(hText)}</h${level}>`);
        continue;
      }
      // List items
      const li = /^[-*]\s+(.*)$/.exec(line);
      if (li) {
        if (!inUl) {
          html.push('<ul>');
          inUl = true;
        }
        const liText = li?.[1] ?? '';
        html.push(`<li>${formatInline(liText)}</li>`);
        continue;
      }
      // Paragraph
      closeUl();
      html.push(`<p>${formatInline(line)}</p>`);
    }
    closeUl();
    return html.join('\n');
  };

  useEffect(() => {
    const fetchLatest = async () => {
      setErr('');
      try {
        const userResult = await supabase.auth.getUser();
        if (userResult.error || !userResult.data?.user) {
          setErr('Could not fetch user.');
          return;
        }
        const uid = userResult.data.user.id;

        const res = await supabase
          .from('user_riasec_record')
          .select('*')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (res.error) {
          setErr(res.error.message);
          return;
        }
        let rec: RiasecRecord | null = null;
        if (isObject(res.data)) {
          rec = res.data as unknown as RiasecRecord;
        }
        setRiasec(rec);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Unknown error';
        setErr(msg);
      }
    };
    void fetchLatest();
  }, [supabase]);

  const onAsk = async () => {
    if (!riasec) {
      setErr('No RIASEC record found for your account.');
      return;
    }
    setLoading(true);
    setAnswer('');
    setErr('');
    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ riasec, prompt }),
      });
      const jsonUnknown: unknown = await res.json();
      if (!res.ok) {
        const msg = isObject(jsonUnknown) && typeof jsonUnknown.error === 'string'
          ? jsonUnknown.error
          : 'Failed to get AI response';
        setErr(msg);
      } else {
        const output = isObject(jsonUnknown) && typeof jsonUnknown.output === 'string'
          ? jsonUnknown.output
          : null;
        if (output) {
          setAnswer(output);
        } else {
          setErr('Unexpected AI response');
        }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to call AI';
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>AI Career Advisor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          I use your latest RIASEC record to craft a tailored learning and career plan.
        </p>
        <div className="space-y-2">
          <label className="text-sm font-medium">Ask a follow-up (optional)</label>
          <textarea
            value={prompt}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
            placeholder="e.g., Emphasize options that balance creativity with stability"
            rows={3}
            className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 dark:bg-neutral-900 dark:border-neutral-800"
          />
        </div>
        <div className="flex gap-3">
          <Button onClick={onAsk} disabled={loading}>
            {loading ? 'Thinking…' : (riasec ? 'Generate Plan' : 'Loading RIASEC…')}
          </Button>
          {err && <span className="text-sm text-red-600">{err}</span>}
        </div>
        {answer && (
          <div className="prose prose-neutral dark:prose-invert max-w-none border rounded-md p-4 bg-white/50 dark:bg-neutral-900/50">
            <div dangerouslySetInnerHTML={{ __html: mdToHtml(answer) }} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
