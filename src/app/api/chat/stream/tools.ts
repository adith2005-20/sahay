import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import {TavilySearch} from '@langchain/tavily'

// Tool to search job listings
export const searchJobsTool = new DynamicStructuredTool({
  name: "search_jobs",
  description: "Search for job listings based on various criteria",
  schema: z.object({
    title: z.string().optional().describe("Job title or role to search for"),
    skills: z.array(z.string()).optional().describe("Required skills for the job"),
    experience: z.number().optional().describe("Years of experience required"),
    location: z.string().optional().describe("Job location"),
  }),
  func: async ({ title, skills, experience, location }) => {
    const jobs = [
      {
        title: "Software Engineer",
        company: "TechCorp",
        skills: ["JavaScript", "React", "Node.js"],
        experience: 2,
        location: "Remote",
      },
      {
        title: "Data Scientist",
        company: "DataCo",
        skills: ["Python", "Machine Learning", "SQL"],
        experience: 3,
        location: "New York",
      },
    ];

    return JSON.stringify(jobs.filter(job =>
      (!title || job.title.toLowerCase().includes(title.toLowerCase())) &&
      (!skills || skills.every(skill => job.skills.includes(skill))) &&
      (!experience || job.experience <= experience) &&
      (!location || job.location.toLowerCase().includes(location.toLowerCase()))
    ));
  },
});

export const collegeGetterTool = new DynamicStructuredTool({
  name: "get_college_info",
  description: "Get information about colleges based on data of student",
  schema: z.object({
    location: z.string().describe("Location of the college. Only provide Indian states & UTs"),
    domain: z.enum(["Engineering & Technology",
"Medical & Health Sciences",
"Arts & Humanities",
"Science & Research",
"Business & Management",
"Law & Legal Studies",
"Skilled Trades",
"Architecture & Planning",
"Fine & Performing Arts",
"Education & Teaching",
"Agricultural Sciences",
"Media & Communication",
"Design",
"Technical & IT Skills"])
  }),
  func: async ({location, domain}) => {
    const response = await fetch("http://localhost:8001/filter-colleges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ location, domain }),
    });
    const data = await response.json();
    return JSON.stringify(data);
  }
})

export const currentTimeTool = new DynamicStructuredTool({
  name: "current_time",
  description: "Get the current date and time",
  schema: z.object({}),
  func: async () => {
    return new Date().toISOString();
  },
});

export const tavilySearchTool = new TavilySearch({
  maxResults: 5
})

export const tools = [
  currentTimeTool,
  collegeGetterTool,
  tavilySearchTool
];
