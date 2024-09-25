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
import U_books from '../pages/U_books'
import U_searchperi from '../pages/U_searchperi'
import Addstaff from '../pages/AddStaff'
import StaffPage from '../pages/StaffPage'
import About from '../pages/About'
import Listbook from '../pages/Listbook'
import Listuser from '../pages/Listuser'




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
                path : "forgot-password",
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
                path : "U_books",
                element : <U_books/>
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

        ]
    }
])

export default router

