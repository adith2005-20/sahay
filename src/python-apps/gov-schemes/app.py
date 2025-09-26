import numpy
import pandas as pd
import os
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv
import google.generativeai as genai
from typing import Optional, List

load_dotenv()

data = pd.read_csv("./archive/updated_data.csv")

app = FastAPI()
filter_cols = ['eligibility', 'schemeCategory', 'tags', 'level']

class SchemeFilterRequest(BaseModel):
    eligibility: Optional[str] = None
    level: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None



@app.post("/filter-schemes")
async def filter_schemes_endpoint(request: SchemeFilterRequest):

    filtered_df = data.copy()

    if request.eligibility:
        filtered_df = filtered_df[filtered_df['eligibility'].str.contains(request.eligibility, case=False, na=False)]

    if request.level:
        filtered_df = filtered_df[filtered_df['schemeCategory'].str.contains(request.level, case=False, na=False)]

    if request.category:
        filtered_df = filtered_df[
            filtered_df['schemeCategory'].str.contains(request.category, case=False, na=False) |
            filtered_df['tags'].str.contains(request.category, case=False, na=False)
        ]

    if request.tags:
        for tag in request.tags:
            filtered_df = filtered_df[filtered_df['tags'].str.contains(tag, case=False, na=False)]

    results = filtered_df.to_dict(orient='records')

    return results
