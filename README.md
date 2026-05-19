

# 🏙️ NeighbourHub



## 👥 Team

| Name                         | Role | GitHub profile |
|------------------------------| ---- |---------------|
| Hanusz Bettina Alexandra     | Manager | [fbarnabas55](http://github.com/fbarnabas55) |
| Nagy Zsombor                 | Architect | [nzsombor04](http://github.com/nzsombor04) |
| Szabó Benedek Zoltán         | Fullstack developer | [szabo-benedek](https://github.com/szabo-benedek) |
| Tolnai Levente               | Fullstack developer | [levitolnai](https://github.com/levitolnai) |
| Zsebeházi Máté               | Fullstack developer | [MateZsebehazi](https://github.com/MateZsebehazi) |


---

## 🧑‍💻 Developer Guide

### Requirements
- Node.js + npm
- Angular CLI
- Visual Studio (ASP.NET Core)
- SQL database (LocalDB / MSSQL)
- .NET EF tools

### Frontend (Angular)
```bash
cd Frontend/neighbourhub
npm install
ng serve
```
Runs at: `http://localhost:4200/`

### Backend (ASP.NET Core)
1. Open the solution in Visual Studio
2. Add Migration (if needed)
   ```powershell
   Add-Migration
   ```
3. Update database:
   ```powershell
   Update-Database
   ```
4. Run the Web API (IIS Express or Kestrel)  
5. Swagger UI is available while the backend is running

---

## Use-cases

### Users
- Create a community poll with a deadline
- Vote on an active poll (yes / no / abstain)
- View all polls and their results
- Delete own poll
- Send a message to another resident
- View incoming and sent messages
- Delete a message (soft delete, physically removed only when both parties delete it)
- Reply to a message
- View announcements in carousel display mode.


### Admins
- Delete any poll regardless of ownership
---

## 🔌 API Function List (excerpt)

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/Announcement` | **POST** | Create a new announcement |
| `/api/Announcement` | **GET** | List announcements |
| `/api/Announcement/{id}` | **DELETE** | Delete announcement |
| `/api/Booking` | **GET** | List bookings |
| `/api/Booking` | **POST** | Create a new booking |
| `/api/Booking/availability` | **GET** | List bookings availability |
| `/api/Booking/my` | **GET** | List user own bookings |
| `/api/Booking/{id}/cancel` | **PUT** | Cancel a booking |
| `/api/CommunityRoom` | **GET** | List communityrooms |
| `/api/CommunityRoom` | **POST** | Create a new community room |
| `/api/CommunityRoom/{id}` | **PUT** | Update communityroom |
| `/api/CommunityRoom/{id}` | **DELETE** | Delete communityroom |
| `/api/Dashboard` | **GET** | List statistics |
| `/api/Document` | **POST** | Download a document |
| `/api/Document` | **GET** | List documents |
| `/api/ErrorReport` | **GET** | List error reports |
| `/api/ErrorReport` | **POST** | Submit a new error report |
| `/api/FloorPlan` | **POST** | Create a new floor plan |
| `/api/FloorPlan` | **GET** | List floor plans |
| `/api/Message/sent` | **GET** | List the sent messages |
| `/api/Message` | **POST** | Send a new message |
| `/api/Message/{id}` | **DELETE** | Delete message |
| `/api/Message/recipients` | **GET** | List the recipients messages |
| `/api/User/Register` | **POST** | User registration |
| `/api/User/Login` | **POST** | User login |
| `/api/User/Pendingusers` | **GET** | List pending users |
| `/api/User/Pendingusers` | **POST** | Approve pending user |
| `/api/User/Residents` | **GET** | List residents |
| `/api/Vote` | **GET** | List votes |
| `/api/Vote` | **POST** | Create a new vote |
| `/api/Vote/{id}` | **DELETE** | Delete votes |

Full API is available via Swagger UI.


> Full API is available via Swagger UI.

---

## 🖼️ UI Screens (overview)

| Screen | Purpose |
|---|---|
| Login / Register | User authentication |
| Dashboard | navigation, statistic informations |
| Voting | create vote, vote |
| Issues | issue informations, add issue |
| Announcements | informationt, events |
| Bookings | Book facilities |
| Floor Plans | Floor plans |
| Residents | All users |
| Documents | PDF preview, download |
| Messages | User messages |
| Pending Users (Admin) | Approve or reject registration |

> Screenshots and guideline available in docs.

---

## 🧾 Problem Log

| Problem | Area | Resolution |
|---|---|---|
| CORS error | FE/BE | Configure allowed origins and headers in the API |
| PDF preview restrictions | FE | Embedded PDF viewer with proper CSP settings |
| SCRUM poker scoring | Team | team-based task estimation |
| JWT token handling | FE | Payload decryption |
| File upload size limit | BE | Increased request size and client-side validation |

---

## 📂 Documentation

The repository include a `docs/` directory:
- `usermanual.pdf` — step-by-step end-user manual.

---

## Notes
Project developed at Óbuda University.  
SCRUM methodology; GitHub Issues & Projects used for tracking.
