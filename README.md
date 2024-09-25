# RealEstateApp
## Overview
RealEstateApp is a full-stack real estate management application built using .NET Core for the backend and React for the frontend. The app allows users to register and manage real estate properties, including adding property details, uploading photos, filtering properties, and viewing them on an interactive map. Admin and User roles are handled with JWT-based authentication and authorization.

## Tech Stack
### Backend
* **.NET 8.0 (ASP.NET Core)**
  * Used to build the REST API that manages real estate data and handles authentication.
  * ASP.NET Identity for user and role management (Admin, User).
  * Entity Framework Core with SQL Server for database operations.
  * JWT Authentication for secure API access.
  * Swagger for API documentation.
### Frontend
* **React**
  * User interface for interacting with the real estate data.
  * React Router for navigation.
  * Material UI (MUI) for responsive UI components.
  * React-Leaflet for map display and property markers.
  * React-i18next for multi-language support (Turkish and English).
### Database
* SQL Server
* The primary database for storing user data, property details, photos, and more.
### Libraries & Tools
* JWT (JSON Web Token): Used for secure authentication between the frontend and backend.
* Axios: For making HTTP requests to the backend API.
* MUI (Material UI): Provides pre-built, customizable React components for a responsive UI.
* Formik & Yup: Used for form management and validation.
* React-Leaflet: For embedding interactive maps with property markers.
* i18next: For internationalization and language switching.
### Features
* **User Authentication:**

  * Secure login and registration using JWT.
  * Role-based access (Admin and User).
* **Property Management:**

  * Add, edit, and delete property listings.
  * Upload multiple photos for each property.
  * Filter properties by type, status, price range, and date.
* **Interactive Map:**

  * View properties on a map with markers and popups for detailed information.
* **Multi-language Support:**

  * English and Turkish language options using react-i18next.
* **Dashboard:**

  * A user-friendly dashboard for viewing properties, statistics, and other details.
 

## Diagrams
* **Database Diagram**


![Database Diagram](/README-assets/DbDiagram.png)

* **JWT Token Based Auth Diagram**
![Database Diagram](/README-assets/token-based-authentication.jpg)




## Installation
* Clone the repository:

```
git clone https://github.com/kerembozkurt2002/RealEstateApp.git
```
* Navigate to the project folder:

```
cd RealEstateApp
```
## Backend Setup
* Install the necessary backend dependencies:

```
cd RealEstateApp.API
dotnet restore
```

* Update the appsettings.json file with your SQL Server connection string and JWT secret keys.

* Run the backend:

```
dotnet run
```

## Frontend Setup
* Install the necessary frontend dependencies:

```
cd cd .\RealEstateAppClient\real-estate
npm install
```
* Start the React development server:
```
npm start
```
## Usage
* Open the application in your browser at http://localhost:3000 for the frontend.
* You can log in as either an admin or a regular user.
* Manage properties, upload photos, and view details on the map.
