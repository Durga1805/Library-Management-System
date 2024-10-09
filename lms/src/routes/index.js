import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Login from '../pages/Login'
import ForgotPassword from '../pages/ForgotPassword'
import Userpage from '../pages/Userpage'
import AdminPage from '../pages/Adminpage'
import AddUsers from '../pages/AddUsers'
import U_searchbook from '../pages/U_searchbook'
import A_ManageUser from '../pages/A_ManageUser'
import A_ManageBooks from '../pages/A_ManageBooks'
import AddBooks from '../pages/AddBooks'
import U_periodicals from '../pages/U_periodicals'
import U_searchperi from '../pages/U_searchperi'
import Addstaff from '../pages/AddStaff'
import StaffPage from '../pages/StaffPage'
import About from '../pages/About'
import Listbook from '../pages/Listbook'
import Listuser from '../pages/Listuser'
import SearchResults from '../pages/Searchresult'
import A_SearchBook from '../pages/A_SearchBook'
import A_SearchUsers from '../pages/A_SearchUser'
import A_ManageStaffs from '../pages/A_ManageStaff'
import EditUserDetails from '../pages/EditUserDetails'




const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "",
                element : <Home/>
            },
            {
                path : "about",
                element : <About/>
            },
            {
                path : "login",
                element : <Login/>
            },
            {
                path : "forgotpassword",
                element : <ForgotPassword/>
            },
            
            {
                path : "userpage",
                element : <Userpage/>
            },
            {
                path : "StaffPage",
                element : <StaffPage/>
            },
            
            {
                path : "adminpage",
                element : <AdminPage/>
            },

            
            {
                path : "manage-users",
                element : <A_ManageUser/>
            },
            {
                path : "add-users",
                element : <AddUsers/>
            },
            {
                path : "add-staff",
                element : <Addstaff/>
            },
            
            {
                path : "userch",
                element : <U_searchbook/>
            },
            {
                path : "UPeriodicals",
                element : <U_periodicals/>
            },
            {
                path : "manage-books",
                element : <A_ManageBooks/>
                
            },
            {
                path : "add-books",
                element : <AddBooks/>
            },
            {
                path : "search-results",
                element : <SearchResults/>
            },
            {
                path : "U_searchperi",
                element : <U_searchperi/>
            },
            {
                path : "listuser",
                element : <Listuser/>
            },
            {
                path : "listbook",
                element : <Listbook/>
            },
            {
                path : "A_search",
                element : <A_SearchBook/>
            },
            {
                path : "searchuser",
                element : <A_SearchUsers/>
            },
            {
                path : "manage-staffs",
                element : <A_ManageStaffs/>
            },
            {
                path: "edit-user-details",
                element: <EditUserDetails />
            },

        ]
    }
])

export default router

