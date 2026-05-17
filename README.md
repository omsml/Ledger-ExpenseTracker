# 💰 Ledger — Personal Finance Manager

A clean, responsive **expense tracking web app** built with vanilla HTML, CSS, and JavaScript. Track your spending, set monthly budgets, visualize category-wise breakdowns, and export your data — all without any backend or login required.

---

## ✨ Features

- **Dashboard Overview** — KPI cards showing budget, total spent, remaining balance, and transaction count
- **Add & Edit Expenses** — Log transactions with description, amount, category, and date
- **Category Filtering & Search** — Quickly find any transaction
- **Donut Chart** — Visual distribution of spending across categories
- **7-Day Trend Bar Chart** — See your daily spending pattern for the past week
- **Category Breakdown** — Progress bars showing spend per category
- **Monthly Budget Tracking** — Set a limit and track how much you've used
- **CSV Export** — Download all your transactions as a spreadsheet
- **Light / Dark Mode** — Toggle between themes; preference is saved locally
- **Fully Responsive** — Works on desktop, tablet, and mobile
- **No Backend Required** — All data stored in `localStorage`

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Structure & markup |
| CSS3 | Styling, animations, theming |
| Vanilla JavaScript (ES6+) | Logic, state management, localStorage |
| [Chart.js](https://www.chartjs.org/) | Donut and bar charts |
| [Font Awesome 6](https://fontawesome.com/) | Icons |
| [Google Fonts](https://fonts.google.com/) | Playfair Display + DM Sans |

---

## 📁 Project Structure

```
ledger/
├── index.html      # Main HTML structure
├── style.css       # All styles, tokens, responsive layout
└── app.js          # JavaScript logic and chart rendering
```

---

## 📸 Screenshots

> Dashboard in Light Mode
<img width="1920" height="901" alt="image" src="https://github.com/user-attachments/assets/8b290553-da40-4eaa-87c1-21746a804251" />

> Dashboard in Dark Mode
<img width="1920" height="915" alt="image" src="https://github.com/user-attachments/assets/c463e942-41a4-4e4f-af17-64d68451bfac" />


---

## 📦 Expense Categories

| Icon | Category |
|---|---|
| 🍽️ | Food & Dining |
| ✈️ | Travel |
| 🛍️ | Shopping |
| 💊 | Health & Medical |
| 📄 | Bills & Utilities |
| 🎭 | Entertainment |
| 📚 | Education |
| 📦 | Other |

---

## 💾 Data Storage

All data is stored in your browser's `localStorage` under these keys:

| Key | Description |
|---|---|
| `ldg_exps` | Array of all expense objects |
| `ldg_bud` | Monthly budget value |
| `ldg_theme` | Saved theme preference (`light` / `dark`) |

> ⚠️ Clearing browser data will erase all transactions. Use the **Export CSV** feature regularly to back up your data.

---

## 🗺️ Roadmap

- [ ] Monthly/yearly reports
- [ ] Recurring expense support
- [ ] Import from CSV
- [ ] PWA support (offline-capable)
- [ ] Multiple currencies

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Omm Prakash Samal**
Bhubaneswar, Odisha, India


---

<p align="center">Made with ❤️ by omsml</p>
