# 🌿 CUK Biodiversity Portal

A dynamic biodiversity web portal developed for the **Central University of Karnataka (CUK)** to digitally document and explore the flora and fauna found across the university campus.

The portal converts biodiversity observations collected from **iNaturalist** into structured JSON files and displays them through an interactive website.

---

# 📖 Project Overview

The CUK Biodiversity Portal is designed to:

- Document biodiversity found inside the CUK campus.
- Provide an easy way to search plant and animal species.
- Organize observations into different biodiversity categories.
- Visualize biodiversity information through a modern web interface.
- Build a digital biodiversity archive for future students and researchers.

---

# 🚀 Features

## ✅ Completed

- Homepage
- Dynamic Flora Explorer
- Dynamic Fauna Explorer
- Search System
- Category Filtering
- Responsive Design
- Dynamic Species Cards
- JSON-based Data Engine
- Reusable Navbar & Footer
- Statistics Generation
- Excel to JSON Conversion

---

## 🚧 Under Development

- Species Details Page
- Interactive Campus Map
- Latitude & Longitude Mapping
- Observation Popups
- Advanced Search
- Dashboard & Analytics

---

# 🛠 Tech Stack

## Frontend

- HTML5
- CSS3
- Bootstrap 5
- JavaScript (Vanilla)

## Backend (Data Processing)

- Node.js

## Data Source

- Microsoft Excel (.xlsx)
- iNaturalist Observations

---

# 📂 Project Structure

```
CUK-Biodiversity-Portal/

│
├── index.html
│
├── components/
│     ├── navbar.html
│     └── footer.html
│
├── css/
│     ├── style.css
│     ├── navbar.css
│     ├── footer.css
│     ├── cards.css
│     ├── explorer.css
│     ├── responsive.css
│     ├── map.css
│     ├── search.css
│     └── species.css
│
├── js/
│     ├── main.js
│     ├── navbar.js
│     ├── footer.js
│     ├── flora.js
│     ├── fauna.js
│     ├── species.js
│     ├── search.js
│     └── map.js
│
├── pages/
│     ├── flora.html
│     ├── fauna.html
│     ├── species.html
│     ├── map.html
│     ├── search.html
│     └── about.html
│
├── data/
│     ├── species.json
│     ├── observations.json
│     ├── categories.json
│     ├── taxonomy.json
│     ├── statistics.json
│     ├── search-index.json
│     └── locations.json
│
├── tools/
│     ├── excelToJson.js
│     ├── helpers.js
│     ├── config.js
│     └── logger.js
│
├── package.json
└── README.md
```

---

# 📊 Dataset

Current Dataset

- 546 Observations
- 360 Unique Species
- 10 Biodiversity Categories

Categories include

- Plants
- Birds
- Mammals
- Reptiles
- Amphibians
- Insects
- Arachnids
- Fungi
- Molluscs
- Others

---

# 🔄 Workflow

## Step 1

Collect biodiversity observations using **iNaturalist**.

↓

## Step 2

Export observations into Excel format.

↓

## Step 3

Place the Excel file inside the project folder.

↓

## Step 4

Run the conversion tool

```bash
node tools/excelToJson.js
```

↓

## Step 5

The script automatically generates

```
species.json
observations.json
categories.json
statistics.json
taxonomy.json
search-index.json
locations.json
```

↓

## Step 6

Frontend pages automatically read these JSON files.

No manual editing is required.

---

# ▶ Running the Project

## Install dependencies

```bash
npm install
```

## Start a local server

You may use any local server.

Example:

```bash
npx http-server
```

or

Use the **Live Server** extension in Visual Studio Code.

Open

```
index.html
```

and start exploring.

---

# 👥 Team Contribution

Current Completed Modules

- Data Processing Engine
- Homepage
- Flora Explorer
- Fauna Explorer
- Search
- Responsive UI
- Navigation Components

Current Development

- Species Details Page
- Interactive Campus Map
- Observation Marker Integration
- Latitude & Longitude Mapping

---

# 📌 Future Improvements

- Interactive GIS Map
- Observation Timeline
- Species Distribution
- Image Gallery
- Admin Dashboard
- Data Upload Portal
- Research Export
- AI-powered Species Search

---

# 🤝 Contribution Guide

1. Pull the latest code

```
git pull
```

2. Create a new branch

```
git checkout -b feature-name
```

3. Make changes

4. Commit

```
git add .
git commit -m "Describe your changes"
```

5. Push

```
git push origin feature-name
```

6. Create a Pull Request

---

# 📜 License

This project is developed for academic and educational purposes at the **Central University of Karnataka**.

---
# 👨‍💻 Project Lead

**Satyam Kumar Jha**

B.Tech Electrical Engineering

Central University of Karnataka

Responsible for:

- Project Architecture
- Website Development
- Frontend Design
- Data Processing Pipeline
- JSON Generation Engine
- GitHub Repository Management

---

# 🤝 Contributors

This project is an interdisciplinary initiative involving contributors from multiple departments of the Central University of Karnataka.

Contributors include students and faculty members from:

- Department of Life Sciences
- Department of Electrical Engineering
- Other participating departments

The biodiversity observations, species identification, and ecological information are contributed collaboratively by members from these departments.

---

# 🎯 Project Objective

The CUK Biodiversity Portal aims to create a digital biodiversity database of the Central University of Karnataka campus by combining ecological observations with modern web technologies.

The project promotes interdisciplinary collaboration between biological sciences and engineering to document, visualize, and preserve campus biodiversity.
