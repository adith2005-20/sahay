import os
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
if not supabase_url or not supabase_key:
    raise ValueError("Supabase URL and Key must be set in the .env file.")
supabase: Client = create_client(supabase_url, supabase_key)

app = FastAPI()

class FilterRequest(BaseModel):
    location : str
    domain : str

# def get_institutes(location:str, domain:str)-> list:
#     course_response = supabase.table('courses').select('id').eq('name', domain).execute()
#     if not course_response.data:
#         return []

#     matching_course_ids = [course['id'] for course in course_response.data]

#     college_response = supabase.table('colleges').select(
#         'id, name, type, city, state, nirf_rank, average_fee, avg_placement_package, courses'
#     ).or_(
#         f"city.eq.{location},state.eq.{location}"
#     ).cs(
#         'courses', matching_course_ids
#     ).execute()

#     if not college_response.data:
#         return []
        
#     colleges = college_response.data

#     all_course_ids_to_fetch = {cid for college in colleges for cid in college['courses']}
        
#     course_details_response = supabase.table('courses').select('*').in_('id', list(all_course_ids_to_fetch)).execute()
        
#     if not course_details_response.data:
#         return colleges

#     course_details_map = {course['id']: course for course in course_details_response.data}

#     for college in colleges:
#         college['courses'] = [course_details_map.get(cid) for cid in college['courses'] if course_details_map.get(cid)]

#     return colleges

def get_institutes(location: str, domain: str) -> list:
    course_response = supabase.table('courses').select('id').eq('name', domain).execute()
    if not course_response.data:
        return []

    matching_course_ids = [course['id'] for course in course_response.data]

    location_colleges_response = supabase.table('colleges').select(
        'id, name, type, city, state, nirf_rank, average_fee, avg_placement_package, courses'
    ).or_(
        f"city.eq.{location},state.eq.{location}"
    ).execute()

    if not location_colleges_response.data:
        return []

    filtered_colleges = []
    for college in location_colleges_response.data:
        college_courses_str = college.get('courses', '')
        
        if college_courses_str:
            course_list = [course.strip() for course in college_courses_str.split(',')]
            
            if any(course_id in course_list for course_id in matching_course_ids):
                college['courses'] = course_list
                filtered_colleges.append(college)
    
    if not filtered_colleges:
        return []

    colleges = filtered_colleges

    all_course_ids_to_fetch = set()
    for college in colleges:
        course_list = college.get('courses', [])
        all_course_ids_to_fetch.update(course_list)
        
    course_details_response = supabase.table('courses').select('id, duration_years, required_stream').in_('id', list(all_course_ids_to_fetch)).execute()
    
    course_details_map = {course['id']: course for course in course_details_response.data}
    
    formatted_results = []
    for college in colleges:
        course_list = college.get('courses', [])
        
        requested_course_details = None
        for course_id in matching_course_ids:
            if course_id in course_list and course_id in course_details_map:
                course = course_details_map[course_id]
                requested_course_details = {
                    'duration_years': course.get('duration_years'),
                    'required_stream': course.get('required_stream')
                }
                break
        
        formatted_college = {
            'name': college.get('name'),
            'type': college.get('type'),
            'city': college.get('city'),
            'state': college.get('state'),
            'rank': college.get('nirf_rank'),
            'fee': college.get('average_fee'),
            'avg_placement_package': college.get('avg_placement_package'),
            'duration_years':requested_course_details.get('duration_years'),
            'required_stream': requested_course_details.get('required_stream')
        }
        formatted_results.append(formatted_college)
    
    return formatted_results

@app.post("/filter-colleges")
async def filter_colleges_endpoint(request: FilterRequest):
    filtered_data = get_institutes(request.location, request.domain)
    return filtered_data
if __name__ == "__main__":
    target_location = "Delhi"
    target_domain = "Engineering & Technology" 
    
    print(f"Searching for colleges in '{target_location}' with domain '{target_domain}'...\n")
    
    results = get_institutes(target_location, target_domain)
    print(results)

    if results:
        print("\n--- FLATTENED RESULTS ---")
        print(json.dumps(results, indent=2))