from login import login

session, user = login()

# Add dummy data to the applications column
url = "http://localhost:8000/internship/67dd4b16a66e442099d52941/apply"
data = {
  "fullName": "Maya Thompson",
  "email": "maya.thompson@studentemail.com",
  "phoneNumber": "+1-984-555-0193",
  "age": 17,
  "location": "Cary, NC",
  "education": "Senior at Panther Creek High School, expected graduation: June 2025. Completed AP Computer Science A and AP Calculus AB.",
  "workExperience": "Built several personal coding projects including a to-do list app in React and a weather app using Python and Flask. Participated in a local hackathon where my team won 2nd place for developing a school club management platform. Volunteer IT assistant at the school library, helping troubleshoot devices and maintain Chromebooks.",
  "skills": "Python, Java, JavaScript, HTML/CSS, React (beginner), Git, basic Linux terminal",
  "fitAnswer": "I’m excited about this opportunity because I love building things with code and want to learn what it's like to work in a real software development team. I’m self-taught in many tools and technologies and am looking forward to growing my skills by working on real projects at TechNova.",
  "resumeUrl": "https://example-bucket.s3.amazonaws.com/resumes/maya-thompson-resume.pdf"
}
resp = session.post(url, json=data)
print(resp.json())