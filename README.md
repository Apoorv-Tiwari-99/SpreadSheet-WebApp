# React Spreadsheet Prototype

This is a static, front-end-only React prototype built to visually replicate the provided Figma design, emulating a spreadsheet-like interface.

## 🚀 Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/react-spreadsheet-assignment.git
   cd react-spreadsheet-assignment
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run the Project**

   ```bash
   npm run dev
   ```

4. **Lint and Type Check**

   ```bash
   npm run lint
   npm run type-check
   ```

## 🛠 Tech Stack

* **React 18 + Vite**
* **TypeScript (strict mode)**
* **Tailwind CSS**
* **react-table** for grid layout

## 📌 Features

* Pixel-perfect layout based on [Figma design](https://www.figma.com/design/3nywpu5sz45RrCmwe68QZP/Intern-Design-Assigment?node-id=2-2535&t=DJGGMt8I4fiZjoIB-1)
* Spreadsheet-style UI with scrollable rows and resizable columns (if stretch completed)
* Interactive tabs, buttons, and toolbar (logs actions to console)
* Responsive, accessible layout
* Code follows ESLint + Prettier conventions

## ⚖️ Trade-offs & Notes

* **State Management**: Local component state was used to avoid unnecessary complexity, as required.
* **Custom Grid**: While `react-table` was used for base functionality, minor custom styling and logic were added to match the spreadsheet layout.
* **Keyboard Navigation & Column Resize**: Implemented partially due to time constraints. May not cover all edge cases like cell selection or multi-cell navigation.
* **No Backend/Data Persistence**: This is a purely static front-end prototype, as per the assignment scope.

