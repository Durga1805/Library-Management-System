// LIBRARY_MANAGEMENT_SYSTEM\lms\src\routes\index.js
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Chatbot from '../components/Chatbot'; // Adjust the path
import Userpage from '../pages/Userpage';
import AdminPage from '../pages/Adminpage';
import AddUsers from '../pages/AddUsers';

import A_ManageUser from '../pages/A_ManageUser';

import StaffPage from '../pages/StaffPage';
import About from '../pages/About';
import FeedbackList from '../pages/FeedbackList';

import SearchUser from '../pages/SearchUser';
import ListUser from '../pages/ListUser';
import LibStaffPage from '../pages/LibStaffPage';
import AddBooks from '../pages/AddBooks';
import SearchAndListBooks from '../pages/SearchAndListBooks';
import SearchAndListUsers from '../pages/SearchAndListUsers';
import ProfileSettings from '../pages/ProfileSettings';
import ProtectedRoute from '../components/ProtectedRoute';
import ViewBooks from '../pages/ViewBooks';
import MyBorrowedBooks from '../pages/MyBorrowedBooks';
import StudentProfile from '../pages/StudentProfile';
import S_ViewBooks from '../pages/S_ViewBooks';
import MyBooksDetails from '../pages/MyBooksDetails';
import StaffProfile from '../pages/StaffProfile';
import ManageIssuedBooks from '../pages/ManageIssuedBooks';
import ManageUsers from '../pages/ManageUsers';
import ReportsAnalytics from '../pages/ReportsAnalytics';
import LendingArchives from '../pages/LendingArchives';
import MyHistory from '../pages/MyHistory';
import UploadNewspaper from '../pages/UploadNewspaper';
import StudentNewspaper from '../pages/StudentNewspaper';
import StaffNewspaper from '../pages/StaffNewspaper';
import GuestBooks from '../pages/GuestBooks';
import NewspaperPage from '../pages/NewspaperPage';
import BookRequest from '../pages/BookRequest';
import RequestBook from '../pages/RequestBook';
import ManageBookRequests from '../pages/ManageBookRequests';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "about",
                element: <About />
            },
            {
                path: "login",
                element: <Login />
            },
            
            {
                path: "userpage",
                element: (
                    <ProtectedRoute allowedRoles={['student']}>
                        <Userpage />
                    </ProtectedRoute>
                )
            },
            {
                path: "staffpage",
                element: (
                    <ProtectedRoute allowedRoles={['staff']}>
                        <StaffPage />
                    </ProtectedRoute>
                )
            },
            {
                path: "adminpage",
                element: <AdminPage />
            },
            {
                path: "manage-users",
                element: <A_ManageUser />
            },
            {
                path: "add-users",
                element: <AddUsers />
            },{
                path: "addbooks",
                element: <AddBooks />
            },
            
           
           
            {
                path: "searchuser",
                element: <SearchUser />
            },
            {
                path: "listuser",
                element: <ListUser />
            },
            
            {
                path: "list-feedback",
                element: <FeedbackList />
            },
            {
                path: "libstaffpage",
                element: (
                    <ProtectedRoute allowedRoles={['libstaff']}>
                        <LibStaffPage />
                    </ProtectedRoute>
                )
            },
            {
                path: "search-list-books",
                element: <SearchAndListBooks />
            },
            {
                path: "search-list-users",
                element: <SearchAndListUsers />
            },
            {
                path: "profile",
                element: <ProfileSettings />
            },
            {
                path: "view-books",
                element: (
                    <ProtectedRoute allowedRoles={['student']}>
                        <ViewBooks />
                    </ProtectedRoute>
                )
            },
            {
                path: "my-borrowed-books",
                element: (
                    <ProtectedRoute allowedRoles={['student']}>
                        <MyBorrowedBooks />
                    </ProtectedRoute>
                )
            },
            {
                path : "/",
                element: <Chatbot />
            },
            {
                path: "studentprofile",
                element: <StudentProfile />
            },
            {
                path: "viewbooks",
                element: <S_ViewBooks />
            },
            {
                path: "my-books-details",
                element: (
                    <ProtectedRoute allowedRoles={['staff']}>
                        <MyBooksDetails />
                    </ProtectedRoute>
                )
            },
            {
                path: "staffprofile",
                element: <StaffProfile />
            },
            {
                path: "issue-books",
                element: (
                    <ProtectedRoute allowedRoles={['libstaff']}>
                        <ManageIssuedBooks />
                    </ProtectedRoute>
                )
            },
            {
                path: "libstaffpage",
                element: <LibStaffPage />
            },  
            {
                path: "profile",
                element: <ProfileSettings />
            },
            {
                path: "users",
                element: (
                    <ProtectedRoute allowedRoles={['libstaff']}>
                        <ManageUsers />
                    </ProtectedRoute>
                )
            },
            {
                path: "reports",
                element: (
                    <ProtectedRoute allowedRoles={['libstaff']}>
                        <ReportsAnalytics />
                    </ProtectedRoute>
                )
            },
            {
                path: "lending-archives",
                element: (
                    <ProtectedRoute allowedRoles={['staff']}>
                        <LendingArchives />
                    </ProtectedRoute>
                )
            },
            {
                path: "my-history",
                element: (
                    <ProtectedRoute allowedRoles={['student']}>
                        <MyHistory />
                    </ProtectedRoute>
                )
            },
            {
                path: "upload-newspaper",
                element: (
                    <ProtectedRoute allowedRoles={['libstaff']}>
                        <UploadNewspaper />
                    </ProtectedRoute>
                )
            },
            {
                path: "student-newspaper",
                element: (
                    <ProtectedRoute allowedRoles={['student']}>
                        <StudentNewspaper />
                    </ProtectedRoute>
                )
            },
            {
                path: "staffnewspaper",
                element: (
                    <ProtectedRoute allowedRoles={['staff']}>
                        <StaffNewspaper />
                    </ProtectedRoute>
                )
            },
            {
                path: "books",
                element: <GuestBooks />
            },
            {
                path: "guestnewspaper",
                element: <NewspaperPage />
            },
            {
                path: "book-request",
                element: (
                    <ProtectedRoute allowedRoles={['student']}>
                        <BookRequest />
                    </ProtectedRoute>
                )
            },
            {
                path: "staffSuggestion",
                element: (
                    <ProtectedRoute allowedRoles={['staff']}>
                        <RequestBook />
                    </ProtectedRoute>
                )
            },
            {
                path: "manage-book-requests",
                element: (
                    <ProtectedRoute allowedRoles={['libstaff']}>
                        <ManageBookRequests />
                    </ProtectedRoute>
                )
            }

        ]
    }
]);

export default router;

