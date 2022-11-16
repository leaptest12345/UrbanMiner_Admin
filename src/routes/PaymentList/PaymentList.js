import { database } from "configs/firebaseConfig";
import { onValue, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { createUseStyles, useTheme } from "react-jss";

import { withStyles } from '@material-ui/core/styles'; 
import Table from '@material-ui/core/Table'; 
import TableBody from '@material-ui/core/TableBody'; 
import TableCell from '@material-ui/core/TableCell'; 
import TableContainer from '@material-ui/core/TableContainer'; 
import TableHead from '@material-ui/core/TableHead'; 
import TableRow from '@material-ui/core/TableRow'; 
import Paper from '@material-ui/core/Paper';
import {Delete} from '@material-ui/icons'
import { notify } from "util/notify";
import { ToastContainer } from "react-toastify";
import { v4 as uuid } from 'uuid';
import { Button } from "@material-ui/core";

const useStyles = createUseStyles((theme)=>({
    cardsContainer: {
        marginRight: -30,
        marginTop: -30
    },
    input:{
        height:50,
        width:"50%",
        borderRadius:10,
        padding:20
    },
    btn:{
        height:50,
        width:'20%',
        borderRadius:10,
        borderWidth:0.5,
        backgroundColor:theme.color.veryDarkGrayishBlue,
        color:"white",
        marginLeft:40
    },
    bottomView:{
        // backgroundColor:'red',

        widh:'100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-between',
        marginTop:50
    },
    bottomView1:{
        // backgroundImage: `linear-gradient(to right,#ffffff,#000001)`,
        backgroundColor:theme.color.veryDarkGrayishBlue,
        width:'100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-between',
        marginTop:50,
        height:50,
        alignItems:'center',
        borderRadius:10,
        padding:20
    },
    addItemView:{
        display:'flex',
        flexDirection:'row',
        alignSelf:'flex-end'
    },
    h1:{
        color:"white",
        fontSize:23
    },
    h3:{
        color:theme.color.veryDarkGrayishBlue
    },
    img:{
        width:100,height:50
    }
    
}));




export default function PaymentList()
{

    const id=uuid().slice(0,8)
    const [itemName,setItemName]=useState('')
    const [data,setData]=useState([])
    

    const theme=useTheme()

    const btn={
        height:50,
        width:'20%',
        borderRadius:10,
        borderWidth:0.5,
        backgroundColor:theme.color.veryDarkGrayishBlue,
        color:"white",
        marginLeft:40
    }

    const addedOrNot = () => {
        let temp = false;
        data.map(item => {
          if (item.title.toLowerCase() == itemName.trim().toLocaleLowerCase()) temp = true;
        });
        return temp;
      };

      const StyledTableCell = withStyles(() => ({
        head: {
           backgroundColor: theme.color.veryDarkGrayishBlue,
           color: theme.color.white,
        },
        body: {
           fontSize: 14,
        },
     }))(TableCell);
     const StyledTableRow = withStyles(() => ({
        root: {
           '&:nth-of-type(odd)': {
              backgroundColor:theme.color.lightGrayishBlue,
           },
        },
     }))(TableRow);
     
    function handleSubmit(e) {
        console.log("inside")
        e.preventDefault();
        try{
            if(itemName.trim()&&!addedOrNot())
            {
                const starCount=ref(database,`/ADMIN/PAYMENTTYPE/${id}`)
                set(starCount,{
                    ID:id,
                    title: itemName.trim(),
                })
                setItemName('')
                setTimeout(() => {
                    notify("PaymentMethod Successfully Added!",1) 
                }, 100);
            }
            else{
               if(itemName.trim())
               notify("Method Already Added!",2)
               else 
               notify("Invalid PaymentMethod!",0)
            }
        }
        catch(error)
        {
            console.log(error)
        }
      }
    const classes = useStyles(theme);
    const onchange=(event)=>{
     console.log(event.target.value)
     setItemName(event.target.value)
    }
    const getPaymentList=()=>{
        try{
            const starCountRef = ref(database, '/ADMIN/PAYMENTTYPE');
            onValue(starCountRef, (snapshot) => {
            let arr=[]
            const data = snapshot.val();
            const isArray= Array.isArray(data)
            if(isArray)
            {
                const newArr=data.filter(item=>item)
                setData(newArr)
            }
            else 
            {
                let arr=[]
                for (let key in data) {
                    if (data.hasOwnProperty(key)) {
                        let value = data[key];
                        arr.push(value)
                    }
                }
                console.log(arr)
                const newArr=arr.filter(item=>item)
                setData(newArr)
               
            }
            console.log(isArray)
            });
        }
        catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        getPaymentList()
    },[])
    
    const onDelete=(item)=>{
        try{
            const starCount=ref(database,`/ADMIN/PAYMENTTYPE/${item.ID}`)
            set(starCount,null);
            setTimeout(() => {
                notify("PaymentMethod has been Deleted!",0) 
            }, 100);
        }
        catch(error)
        {
            console.log(error)
        }
    }
    return(
        <div className={classes.mainDiv}>
            <form onSubmit={handleSubmit}>
            <div className={classes.addItemView}>
            <input
            value={itemName}
            className={classes.input}
            onChange={onchange}
            />
           <Button
            type="submit"
            style={btn}
            >
            Add
            </Button>
            </div>
            </form>
            <TableContainer
            style={{
                marginTop:100
            }}
            component={Paper}>
   <Table aria-label="customized table">
      <TableHead>
         <TableRow>
         <StyledTableCell align="left">No.</StyledTableCell>
         <StyledTableCell align="left">ItemName</StyledTableCell>
            <StyledTableCell align="left">Action</StyledTableCell>

         </TableRow>
      </TableHead>
      <TableBody>
        {data&&data.map((item,index) => 
          <StyledTableRow align="left" key={item.id}>
            <StyledTableCell component="th" scope="row">
             {index+1}
          </StyledTableCell>
              <StyledTableCell align="left">{item.title}</StyledTableCell>
          <StyledTableCell component="th" scope="row">
            <Delete onClick={()=>onDelete(item)}></Delete>
          </StyledTableCell>
         
       </StyledTableRow>
          )}
      </TableBody>
   </Table>
  </TableContainer>
  <ToastContainer className='toast'/>
            {/* <div className={classes.bottomView1}>
                <h1 className={classes.h1}>No</h1>
                <h1 className={classes.h1}>ItemName</h1>
                <h1 className={classes.h1}>Actions</h1>
            </div>
            <ul>
           {data.map((item,index) => (
            <li className={classes.bottomView} key={index}>
            <h3 className={classes.h3}>{index+1}</h3>
             <h3 className={classes.h3}>{item.title}</h3>
             <div className={classes.h3}
             ><img className={classes.img}
             onClick={()=>onDelete(item)} 
             src={require('../../assets/icons/checkbox-off')} /></div>
            </li>

        ))}
    </ul> */}
        </div>
    )
}