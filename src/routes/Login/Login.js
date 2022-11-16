import React, { useEffect, useState } from 'react'
import { Grid,Paper, Avatar, TextField, Button, Typography,Link } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { useTheme } from 'react-jss';
import { UserContext } from 'util/userContext';
import { notify } from 'util/notify';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { onValue, ref, set, update } from 'firebase/database';
import { database } from 'configs/firebaseConfig';
import { formateData } from 'util/formateData';
import {useDispatch,useSelector} from 'react-redux'
import { setUser } from 'Redux/actions/userAction';
import { ToastContainer } from 'react-toastify';
import LoadingSpinner from 'components/Spinner/LoadingSpinner';
const Login=()=>{
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [users,setUsers]=useState([])
    const [loading,setLoading]=useState('')
    const {signIn1} = React.useContext(UserContext);
   
    const dispatch=useDispatch()

    const user=useSelector(state=>state)


   const theme=useTheme()
    const paperStyle={padding :20,height:'90vh',width:500,
    backgroundColor:theme.color.WHITE,}
    const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'10px 0',
    height:50,
    backgroundColor:theme.color.veryDarkGrayishBlue,
    color:theme.color.white}
    const auth = getAuth();
    const onSubmit=async()=>{
   
    if(!email)
      notify('Please Fill The Email Filed!',0)
    else if(!password)
      notify('Please Fill The password Field!',0)
     else{
      setLoading(true)
        try{
           const userCredential=await signInWithEmailAndPassword(auth, email, password)
           if(userCredential.user.uid)
           {
            users&&users.map((item,index)=>{
                if(item.email==email)
                {
                    signIn1(item.ID+'',item.role.PermissionStatus)
                     dispatch(setUser(item))
                     notify("Login Successfully Done!",1)
                     setLoading(false)
                     return;
                }
             })
           }
         // const refDetail=ref(database,'/USERS/1')
         // update(refDetail,{
         //    ID:1,
         //    role:{
         //       roleName:'admin',
         //       PermissionStatus:{
         //         user:true,
         //          item:true,
         //          payment:true,
         //          privacy:true,
         //          term:true,
         //          addAdmin:true,
         //          feedback:true
         //       }
         //     }
         // })
             
        }
        catch(error)
        {
         setLoading(false)
              const errorMessage = error.message;
              console.error(errorMessage)
              notify(errorMessage,0)
        }
     }
 } 
 const onchangeEmail=(e)=>{
    setEmail(e.target.value)
 }
 const onchangePassword=(e)=>{
    setPassword(e.target.value)
 }
 useEffect(()=>{
    getDetail()
 },[])

 const getDetail=()=>{
    try{
        const starCountRef = ref(database, '/USERS');
        onValue(starCountRef, (snapshot) => {
           let data=snapshot.val()
           setUsers(formateData(data))
        })
    }
    catch(error)
    {
        console.log(error)
    }
 }
 const imageUrl='https://img.freepik.com/free-photo/dark-wall-empty-room-with-plants-floor-3d-rendering_41470-3847.jpg?w=1480&t=st=1668601169~exp=1668601769~hmac=efcec17c2a9aee815a134a92d4e98633a7709c9e9573016cf611d51bace21990'
 const containerStyle={
   display:'flex',
   flex:1,
   height:'100vh',
   backgroundColor:theme.color.BG,
   alignItems:'center',
   justifyContent:'center',
   backgroundImage: `url(${imageUrl})` 

 }
    return(
       <div style={containerStyle}>
         {
            loading
            ?<LoadingSpinner/>:null
         }
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center' style={{margin:'20px 0px'}}>
                     <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar>
                    <h2 style={{margin:20}}>Sign In</h2>
                </Grid>
                <TextField onChange={onchangeEmail}
                 style={{margin:'20px 0px'}} 
                 label='Username'
                  placeholder='Enter username'
                   variant="outlined" 
                   fullWidth required/>
                <TextField 
                onChange={onchangePassword} 
                label='Password'
                 placeholder='Enter password'
                  type='password' 
                  variant="outlined"
                   fullWidth required/>
                <FormControlLabel
                style={{marginTop:'50px'}}
                    control={
                    <Checkbox
                        name="checkedB"
                        color="primary"
                    />
                    }
                    label="Remember me"
                 />
                <Button onClick={()=>onSubmit()} type='submit' color={theme.color.white} variant="contained" style={btnstyle} fullWidth>Sign in</Button>
                {/* <Typography style={{marginTop:20}}> Do you have an account ?
                     <Link href="/signup" > Sign Up </Link>
                </Typography> */}
            </Paper>
            <ToastContainer/>
       </div>
    )
}

export default Login