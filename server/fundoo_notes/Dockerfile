# Dockerfile

# Use the official Python image from the Docker Hub
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt /app/

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code into the container
COPY . /app/

# Expose the port the app runs on
EXPOSE 8000

# # Run the Django development server with auto-reload enabled
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
