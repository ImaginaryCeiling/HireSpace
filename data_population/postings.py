import requests
from login import login

session, user = login()

# Add dummy data to the postings column
url = "http://localhost:8000/internship"
data = {
  "fullName": "Aaliyah Nguyen",
  "email": "aaliyah.nguyen@student.pchs.edu",
  "phoneNumber": "+1-984-555-6332",
  "age": 17,
  "location": "Cary, NC",
  "education": "Senior at Panther Creek High School, expected graduation: June 2025. AP courses in Computer Science A, Physics C, and Calculus BC.",
  "workExperience": "Co-led our school's Girls Who Code chapter where I mentored younger students on Python basics. Developed a GPA calculator app using Java and Android Studio for a school project. Interned last summer at a local STEM camp as a coding assistant for middle schoolers.",
  "skills": "Python, Java, Android Studio, HTML/CSS, basic SQL, leadership, public speaking",
  "fitAnswer": "I want to pursue a career in software engineering, and this internship is a perfect next step. I’m excited about working in a collaborative environment and learning best practices in professional development settings. I'm especially interested in backend development and APIs.",
  "resumeUrl": "https://example-bucket.s3.amazonaws.com/resumes/aaliyah-nguyen-resume.pdf"
}
resp = session.post(url, json=data)
print(resp.json())
