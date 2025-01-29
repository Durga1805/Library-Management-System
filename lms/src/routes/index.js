// LIBRARY_MANAGEMENT_SYSTEM\lms\src\routes\index.js
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword'; // Import the ResetPassword component
import Userpage from '../pages/Userpage';
import AdminPage from '../pages/Adminpage';
import AddUsers from '../pages/AddUsers';
import U_searchbook from '../pages/U_searchbook';
import A_ManageUser from '../pages/A_ManageUser';
import A_ManageBooks from '../pages/A_ManageBooks';
import AddBooks from '../pages/AddBooks';
import Addstaff from '../pages/AddStaff';
import StaffPage from '../pages/StaffPage';
import About from '../pages/About';
import Listbook from '../pages/Listbook';
import Listuser from '../pages/Listuser';
import SearchResults from '../pages/Searchresult';
import A_SearchBook from '../pages/A_SearchBook';
import A_SearchUsers from '../pages/A_SearchUser';
import A_ManageStaffs from '../pages/A_ManageStaff';
import EditUserDetails from '../pages/EditUserDetails';
import ListStaff from '../pages/listStaff';
import SearchStaff from '../pages/A_SearchStaff';
import S_searchbook from '../pages/S_searchbook';
import S_Searchresult from '../pages/S_Searchresult';
import StaffLogin from '../pages/StaffLogin';
import ReservedBooks from '../pages/ReservedBooks';
import FeedbackForm from '../pages/FeedbackForm';
import Issuebooks from '../pages/Issuebooks';
import U_issedbooks from '../pages/U_issedbooks';
import ViewProfile1 from '../pages/ViewProfile1';
import FeedbackList from '../pages/FeedbackList';
import History from '../pages/History';
import Staff_issuedbooks from '../pages/Staff_issuedbooks';
import Staff_updateProfile from '../pages/Staff_updateProfile';
// import S_feedback from '../pages/S_feedback';
import S_viewProfile from '../pages/S_viewProfile';
import BookingPage from '../pages/BookingPage';
import Chatbot from '../components/Chatbot'; // Adjust the path




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
                path: "staff-login",
                element: <StaffLogin />
            },
            {
                path: "forgotpassword", // Updated the route name for consistency
                element: <ForgotPassword />
            },
            {
                path: "reset-password/:token", // New route for resetting password
                element: <ResetPassword />
            },
            {
                path: "userpage",
                element: <Userpage />
            },
            {
                path: "staffpage", // Adjusted to lowercase for consistency
                element: <StaffPage />
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
            },
            {
                path: "addstaff",
                element: <Addstaff />
            },
            {
                path: "userch",
                element: <U_searchbook />
            },
           
            {
                path: "manage-books",
                element: <A_ManageBooks />
            },
            {
                path: "add-books",
                element: <AddBooks />
            },
            {
                path: "search-results",
                element: <SearchResults />
            },
            
            {
                path: "listuser",
                element: <Listuser />
            },
            {
                path: "listbook",
                element: <Listbook />
            },
            {
                path: "A_search",
                element: <A_SearchBook />
            },
            {
                path: "searchuser",
                element: <A_SearchUsers />
            },
            {
                path: "manage-staffs",
                element: <A_ManageStaffs />
            },
            {
                path: "edit-user-details",
                element: <EditUserDetails />
            },
            {
                path: "liststaff",
                element: <ListStaff />
            },
            {
                path: "searchstaff",
                element: <SearchStaff />
            },
            {
                path: "ssearch",
                element: <S_searchbook />
            },
            {
                path: "search-books",
                element: <S_Searchresult />
            },
            {
                path: "reserved",
                element: <ReservedBooks />
            },
            {
                path: "feedback",
                element: <FeedbackForm />
            },
            {
                path: "issued",
                element: <Issuebooks />
            },
            {
                path: "issued-books",
                element: <U_issedbooks />
            },
            {
                path: "view-profile",
                element: <ViewProfile1 />
            },
            {
                path: "list-feedback",
                element: <FeedbackList />
            },
            {
                path: "history",
                element: <History />
            },
            {
                path: "S_issued-books",
                element: <Staff_issuedbooks />
            },
            {
                path: "edit-staff-details",
                element: <Staff_updateProfile/>
            },
            
            // {
            //     path: "S_feedback",
            //     element: <S_feedback />
            // },
            {
                path: "s_view-profile",
                element: <S_viewProfile />
            },
            {
                path: "book-booking",
                element: <BookingPage />
            },

            {
                path : "/",
                element: <Chatbot />
            }

        ]
    }
]);



export default router;

