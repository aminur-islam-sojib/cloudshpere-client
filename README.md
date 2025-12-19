# ClubSphere Client

A modern, full-featured web application for creating and managing community clubs, events, and social connections. Built with React, TypeScript, and cutting-edge web technologies.

## 🌟 Features

- **Club Management**: Create, join, and manage community clubs
- **Event Organization**: Plan and attend events within clubs
- **User Authentication**: Secure login and registration with Firebase
- **Dashboard System**: Role-based dashboards for members, managers, and admins
- **Real-time Messaging**: Communicate within clubs and groups
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes
- **Smooth Animations**: Enhanced UX with Framer Motion animations

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion
- **Authentication**: Firebase Auth
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Routing**: React Router
- **Icons**: Lucide React
- **Form Handling**: React Hook Form (implied by components)
- **Linting**: ESLint
- **Package Manager**: npm/yarn

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Firebase project (for authentication and data)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/aminur-islam-sojib/cloudshpere-client.git
   cd cloudshpere-client
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**

   - Copy `.env.example` to `.env`
   - Configure your Firebase credentials and API endpoints

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Shared/          # Reusable UI components
│   │   ├── Hero/        # Landing page sections
│   │   ├── Loader/      # Loading components
│   │   ├── Navbar/      # Navigation components
│   │   └── ui/          # shadcn/ui components
│   └── ui/              # Additional UI components
├── Context/             # React Context providers
├── Hooks/               # Custom React hooks
├── Layouts/             # Page layout components
├── lib/                 # Utilities and configurations
├── Pages/               # Application pages
│   ├── Auth/            # Authentication pages
│   ├── Clubs/           # Club-related pages
│   ├── Dashboard/       # User dashboards
│   ├── Events/          # Event management
│   └── Payment/         # Payment processing
└── Routes/              # Routing configuration
```

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Firestore
3. Add your Firebase config to `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### API Configuration

Configure your backend API endpoints in the environment variables and update the Axios base URL in `src/Hooks/axiosPublic.ts`.

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode**: Automatic theme switching based on user preference
- **Smooth Animations**: Subtle Framer Motion animations for enhanced user experience
- **Accessible**: WCAG compliant components with proper ARIA labels
- **Loading States**: Consistent loading indicators across the application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Author**: Aminur Islam Sojib
- **GitHub**: [@aminur-islam-sojib](https://github.com/aminur-islam-sojib)
- **Project Link**: [https://github.com/aminur-islam-sojib/cloudshpere-client](https://github.com/aminur-islam-sojib/cloudshpere-client)

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Firebase](https://firebase.google.com/) for backend services

---

**Note**: This is the client-side application. Make sure to set up the corresponding backend server for full functionality.
