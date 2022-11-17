 const styles={
     img:{
        width:50,
        height:50,
        borderRadius:100,
        justifyContent:'center',
        alignItems:'center',
        display:'flex'
      },
       rowDiv:{
        display:'flex',
        justifyContent:'flex-start',
        flexDirection:'row',
        alignItems:'center'
      },
       modalDiv:{
        backgroundColor:'white',
        borderRadius:'10px',
        height:'80vh',
        width: '70vw',
        padding:'30px'
      },
       modal:{
        position: 'absolute',
        backgroundColor:'white',
        border:'1px solid black',
        borderRadius:'10px',
        boxShadow: '2px 5px solid black',
        height:'80vh',
        width: '70vw',
        margin: 'auto',
        left:"10%",
        top:"10%"
      },
       inputStyle:{
        height:'45px',
        width:'40vw',
        borderRadius:10,
        outline:'none',
        paddingInline:"10px",
        border:'2px solid black',
        marginTop:'10px'
      },
       textareaStyle:{
        height:'45px',
        width:'40vw',
        borderRadius:10,
        outline:'none',
        paddingInline:"10px",
        border:'2px solid black',
        marginTop:'10px',
        height:'100px',
        padding:'10px',
        width:'50vw'
      },
       btnStyle:{
            background:'#707070',
            color:'white',
            position:'absolute',
            right:'15%',
            top:'14%',
            paddingInline:'1em'
      },
       btnStyle1:{
        background:'#373a47',
        color:'white',
        marginBottom:'5%',
        padding:'1em'
    },
       imgStyle:{
        height:'30vh',
        width:'20vw', 
        borderRadius:10,
        marginTop:'20px'
    },
     imgStyle1:{
      height:'15vh',
      width:'10vw', 
      borderRadius:10,
      marginTop:'20px'
    },
         closeBtn:{
          position:'absolute',
          right:'3%',
          top:'5%',
          background:'#707070',
          color:'white'
        }
}

export default {
    styles
};