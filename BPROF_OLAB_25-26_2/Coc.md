# Code of Conduct

## Introduction

This Code of Conduct defines the policies, rules, and expectations for all employees and contributors. It ensures a respectful, collaborative, and productive working environment, guided by our company's core values and mission. These guidelines outline how individuals should appropriately interact and perform their roles in the workplace.

[Learn more about the Benefits of a Code of Conduct](https://www.indeed.com/career-advice/career-development/code-of-conduct-examples)

## Communication

- All communication must take place via **official Microsoft Teams channels** and group chats dedicated for project purposes.
- All SCRUM team members must have **full visibility** into the internal development process.
- Standup meetings must be **recorded** by the Manager and uploaded to the relevant Teams channel for backup.
- At least **2 meetings** must be held per week.
- During meetings participants **must use camera**.
- **One-on-one private chats** are permitted but must also be conducted within Teams.

## Development Process

- All development activities must follow **SCRUM rules and roles**.
- Each team member is responsible for fulfilling their own role and delivering their assigned work.
- Development must be organized in **sprints** throughout the project lifecycle.

## Boards and Task Management

Each repository will have a **Projects** tab where the task board is maintained. Since GitHub's project boards do not natively support SCRUM sprints, the following workflow will be used:

**Board Columns:**

- `Backlog` → Contains all tasks for the entire project.
- `Sprint # - To Do` → Contains tasks selected for the current sprint.
- `Sprint # - In Progress` → Tasks actively being worked on in the current sprint.
- `Sprint # - In Testing` *(optional)* → Tasks under review or testing in the current sprint.
- `Sprint # - Done` → Completed tasks for given # sprint.

Where # marks sprint no. 1, 2, 3 or 4, so there should be a to do, in progress, in testing, and done column for each sprint.

## Branching Strategy

- GitFlow must be used.
- Use GitKraken connected to GitHub to create branches directly from tickets/issues.
- Branch names must be clear and descriptive, indicating the related problem.
- GitKraken's automatic inclusion of the ticket ID in the branch name is preferred.

**Branch Naming Convention:**

- `feature/#xy-short-branch-name-with-dashes`
- `bugfix/#xy-short-branch-name-with-dashes`

Where `#xy` is the ticket ID in GitHub.

## Pull Requests (PRs)

- **Never merge directly** to the `master` branch locally.
- Create a **Pull Request** from your feature branch into `master`.
- Assign **reviewers** to validate the changes.
- A PR may be merged **only after all reviewers have approved** it.
- If modifications are required, feedback should be provided directly in the PR comments.
- **Every PR must have:**
  - An **assignee** (the creator of the PR)
  - At least **3 reviewers**

## Approved Developer Tools

**Backend Development:**

- [Visual Studio](https://visualstudio.microsoft.com/vs/community/)
- [Visual Studio Code](https://code.visualstudio.com/download)
- [JetBrains Rider](https://www.jetbrains.com/rider/)

**Frontend Development:**

- [Visual Studio Code](https://code.visualstudio.com/download)
- [JetBrains WebStorm](https://www.jetbrains.com/webstorm/)

**Version Control:**

- [GitKraken](https://www.gitkraken.com/download) (Git GUI)

**Issue & Task Management:**

- [GitHub Documentation](https://docs.github.com/en/issues/tracking-your-work-with-issues/about-issues) on Issues, Boards, PRs, and Milestones.

**Estimation Tool:**

- [SCRUM Poker](https://www.scrumpoker-online.org/en/) — to be used during sprint planning.

## SCRUM Poker Guidelines

1. Create a room and join using **real names** for identification.
2. Review each ticket/issue and individually estimate the required effort.
3. All estimates are revealed simultaneously.
4. Discuss any outlier values and provide justification.
5. Record the **average value** as the estimated effort for the ticket.

**Effort Values:**

| Value | Meaning        |
|-------|----------------|
| 1     | 1 hour         |
| 2     | 2 hour         |
| 3     | 3 hour         |
| 4     | 4 hour         |
| 5     | 5 hour         |
| ...   | ...            |

## Enforcement

Failure to comply with this Code of Conduct may result in corrective actions, including removal from the project team.

---

**Document Version:** 1.0  
**Last Updated:** 2025-08-06
