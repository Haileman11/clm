# Contract Lifecycle Management System

A comprehensive contract management system built with Next.js, Prisma, and Refine.

## Features


### Contract Management

- Create, view, edit, and delete contracts

- Track contract status (NEW, PENDING_REVIEW, REVIEWED, ACTIVE, TERMINATED)

- Manage contract attachments with file upload/download

- Track contract periods and expiration dates

- Monitor financial information including currency and total value


### Contract Actions

- **Activation**: Move contracts from REVIEWED to ACTIVE status

- **Termination**: End active contracts and mark them as TERMINATED

- **Renewal**: Extend active contracts with customizable periods (1-60 months)

  - Interactive modal for selecting extension period

  - Automatic expiration date calculation

  - Maintains contract history


### Review System

- Request reviews from legal and category sourcing managers

- Track review status and comments

- Automatic status updates based on review outcomes

- Role-based review assignments

## Design Decisions

### 1. Architecture
- **Next.js App Router**: Chosen for its server-side rendering capabilities and improved routing system
- **Prisma ORM**: Selected for type-safe database operations and schema management
- **Refine Framework**: Used for rapid development of admin interfaces and data management
- **Ant Design**: Implemented for consistent UI components and design patterns
- **NextAuth.js with Keycloak Auth Provider**: Integrated for secure authentication and session management

### 2. State Management
- **Server Components**: Utilized for data fetching and server-side rendering
- **Client Components**: Used for interactive UI elements and form handling
- **Refine Hooks**: Implemented for data fetching, caching, and state management
- **Form State**: Managed through Refine's useForm hook for consistent form handling

### 3. Security
- **Authentication**: Implemented using NextAuth.js with session-based authentication
- **Authorization**: Role-based access control for different user types
- **File Uploads**: Secure file handling with size limits and type validation
- **API Routes**: Protected with session validation and role checks

## User Roles and Permissions

### 1. Contract Manager
- Create and manage contracts
- Upload and manage attachments
- View all contracts and their statuses
- Request reviews from legal and category sourcing teams
- Cannot approve or reject reviews
- Create and manage Vendors and Users

### 2. Contract Owner
- Create and manage their own contracts
- Upload attachments to their contracts
- Request reviews for their contracts
- View their contracts and review statuses
- Cannot approve or reject reviews

### 3. Legal Team
- Receive review requests for legal compliance
- Approve or reject contracts based on legal requirements
- Provide comments and feedback
- View contracts assigned for review
- Cannot create or modify contracts

### 4. Category Sourcing Manager
- Receive review requests for category-specific requirements
- Approve or reject contracts based on sourcing criteria
- Provide comments and feedback
- View contracts assigned for review
- Cannot create or modify contracts

## User Flows

### 1. Contract Creation Flow
1. Contract Manager/Owner creates a new contract
2. System generates a unique contract number
3. User fills in contract details:
   - Basic information
   - Contract period
   - Service information
   - Financial information
   - Stakeholder assignments
4. User uploads relevant attachments
5. Contract is saved with "NEW" status

### 2. Review Request Flow
1. Contract Manager/Owner requests reviews:
   - Legal Review
   - Category Sourcing Review
2. System notifies respective reviewers
3. Contract status changes to "PENDING_REVIEW"
4. Reviewers receive notification and can access the contract

### 3. Review Process Flow
1. Reviewer receives review request
2. Reviewer accesses contract details and attachments
3. Reviewer can:
   - Approve the contract
   - Reject the contract with comments
4. System updates review status
5. If all reviews are completed:
   - All approved → Contract status = "REVIEWED"
   - Any rejected → Contract status = "INACTIVE"

### 4. Contract Lifecycle Flow
1. NEW → Initial contract creation
2. PENDING_REVIEW → Under review process
3. REVIEWED → All reviews completed and approved
4. ACTIVE → Contract is in effect
5. EXPIRED → Contract period ended
6. RENEWED → Contract has been renewed
7. INACTIVE → Contract rejected or terminated
8. TERMINATED → Contract ended prematurely

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Create uploads directory:
   ```bash
   mkdir -p public/uploads
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

## Future Enhancements

1. Email notifications for review requests and updates
2. Contract versioning and change tracking
3. Advanced search and filtering
4. Contract template management
5. Reporting and analytics
6. Integration with external systems
7. Mobile-responsive design improvements
8. Bulk operations for contracts and documents
9. Audit logging for all actions
10. Advanced permission management

## Getting Started

Refine's hooks and components simplifies the development process and eliminates the repetitive tasks by providing industry-standard solutions for crucial aspects of a project, including authentication, access control, routing, networking, state management, and i18n.

## Available Scripts

### Running the development server.
```bash
    npm run dev
```

### Building for production.
```bash
    npm run build
```

### Running the production server.
```bash
    npm run start
```

## Learn More

To learn more about **Refine**, please check out the [Documentation](https://refine.dev/docs)

- **REST Data Provider** [Docs](https://refine.dev/docs/core/providers/data-provider/#overview)
- **Ant Design** [Docs](https://refine.dev/docs/ui-frameworks/antd/tutorial/)
- **Custom Auth Provider** [Docs](https://refine.dev/docs/core/providers/auth-provider/)

## License

MIT
