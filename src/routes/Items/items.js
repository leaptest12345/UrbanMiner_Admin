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
import { ToastContainer } from "react-toastify";
import { notify } from "util/notify";
import { formateData } from "util/formateData";
import { v4 as uuid } from 'uuid';
import { Button } from "@material-ui/core";


const useStyles =
createUseStyles((theme) => ({
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
        backgroundColor:'black',
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
        backgroundColor:theme.color.veryDarkGrayishBlue,
        widh:'100%',
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


export default function Items()
{

    const theme = useTheme();

    const id=uuid().slice(0,8)
    const classes = useStyles({ theme });
    const [itemName,setItemName]=useState('')
    const [data,setData]=useState([])


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
  
    function handleSubmit(e) {
        console.log("inside")
        e.preventDefault();
        try{
            if(itemName.trim()&&!addedOrNot())
            {
                const starCount=ref(database,`/ADMIN/ITEM/${id}`)
                set(starCount,{
                    ID: id,
                    title: itemName.trim(),
                })
                setItemName('')
                notify('Item Successfully Added!',1)
            }
            else{
               if(itemName.trim())
               notify('Item Already Added!',2)
               else 
               notify("invalid itemName",0)
            }
        }
        catch(error)
        {
            console.log(error)
        }
      }
    
    const onchange=(event)=>{
     console.log(event.target.value)
     setItemName(event.target.value)
    }
    useEffect(()=>{
        getItemValues()
    },[])
    const getItemValues=()=>{
        try{
            const starCountRef = ref(database, '/ADMIN/ITEM');
            onValue(starCountRef, (snapshot) => {
            const data=formateData(snapshot.val())
            setData(data)
            });
        }
        catch(error)
        {
            console.log(error)
        }
    }
    const onDelete=(item)=>{
        try{
            const starCount=ref(database,`/ADMIN/ITEM/${item.ID}`)
            set(starCount,null);
            setTimeout(() => {
                notify("Item has been Deleted!",0) 
            }, 100);
        }
        catch(error)
        {
            console.log(error)
        }
    }

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
            {/* <button 
            type="submit"
            className={classes.btn}>Add</button> */}
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
  <ToastContainer/>
        </div>
    )
}