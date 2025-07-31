# NEXMAX DASHBOARD 2025

A comprehensive Next.js dashboard application migrated from PostgreSQL to Supabase with unlimited data display capabilities.

## Features

- **Modern Dashboard Interface** - Clean and responsive design
- **Supabase Backend** - Migrated from PostgreSQL for better scalability
- **Unlimited Data Display** - No pagination limits on transaction pages
- **Real-time Analytics** - Live KPI monitoring and reporting
- **Multi-currency Support** - MYR and other currency support
- **User Management** - Role-based access control
- **Transaction Pages** - Deposit, Withdraw, Exchange, Headcount tracking

## Tech Stack

- **Frontend**: Next.js 15.4.3, React
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: JWT with NextAuth
- **Styling**: CSS Modules, Tailwind CSS
- **Charts**: Chart.js components
- **Deployment**: Vercel ready

## Getting Started

1. **Clone the repository**
   `ash
   git clone https://github.com/SevaIrawan/nexmax-dashboard2025.git
   cd nexmax-dashboard2025
   `

2. **Install dependencies**
   `ash
   npm install
   `

3. **Setup environment variables**
   `ash
   cp env.example .env.local
   # Edit .env.local with your Supabase credentials
   `

4. **Run development server**
   `ash
   npm run dev
   `

5. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a .env.local file with the following variables:

`env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
`

## Project Structure

`
nexmax-dashboard2025/
 components/          # React components
 pages/              # Next.js pages and API routes
 lib/                # Database and utility functions
 scripts/            # Migration and setup scripts
 styles/             # CSS and styling files
 docs/               # Documentation
`

## Migration Status

 **Completed**: PostgreSQL to Supabase migration
 **Completed**: All API endpoints updated
 **Completed**: Unlimited data display
 **Completed**: Environment configuration

## Deployment

This project is ready for deployment on Vercel or any Next.js compatible platform.

## License

MIT License - see LICENSE file for details.
