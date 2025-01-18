# Stage 1: Python Build
FROM python:3.9 AS python_build

# Set the working directory for the Python part
WORKDIR /app

# Copy the Python dependencies file from the root
COPY requirements.txt /app/

# Install Python dependencies from the requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Install pandas in case it's not listed in requirements.txt
RUN pip install pandas

# Copy the Python project (AI_MODEL) into the container
COPY AI_MODEL /app/AI_MODEL

# Stage 2: Node.js Build
FROM node:16 AS node_build

# Install Python in the Node.js image (to run Python scripts)
RUN apt-get update && apt-get install -y python3 python3-pip

# Set the working directory for the Node.js part
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package.json package-lock.json /app/

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application files
COPY . /app/

# Build the project (this creates the build folder)
RUN npm run build


# Stage 3: Final image (production)
FROM node:16-slim AS production

# Set the working directory for the production image
WORKDIR /app

# Install Python and pip in the final image, which was missing
RUN apt-get update && apt-get install -y python3 python3-pip

# Ensure pandas is installed in production image (added this line)
RUN pip3 install pandas

# Copy the Python dependencies from the python_build stage
COPY --from=python_build /app /app

# Copy the built Node.js dependencies from the node_build stage
COPY --from=node_build /app /app

# Expose port 5000 for the Node.js server
EXPOSE 5000

# Command to run the Node.js application
CMD ["npm", "run", "start"]
