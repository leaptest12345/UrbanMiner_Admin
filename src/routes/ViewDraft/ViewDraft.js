import { database } from "configs/firebaseConfig";
import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { convertIntoDoller } from "util/convertIntoDoller";
import { formateData } from "util/formateData";


export default function ViewDraft(props)
{
    const [invoices,setInvoices]=useState([])
    const [invoiceImg,setInvoiceImg]=useState([])
    const{ invoiceId,userId,customerId}=props.location.state
    console.log("all theree value",invoiceId,userId,customerId)
    useEffect(()=>{
        getDraftDetail()
    },[])
    const getDraftDetail=()=>{
        try{
            const refDetail=ref(database,`/INVOICE/${invoiceId}`)
            onValue(refDetail,snapShot=>{
                const data=formateData(snapShot.val())
                console.log("draft invoices",data)
                setInvoices(data)
            })
            const refDeatail1=ref(database,`/INVOICE_IMAGES/User:${userId}/customer:${customerId}/invoice:${invoiceId}`)
            onValue(refDeatail1,snapShot=>{
                const arr=[]
                const data=formateData(snapShot.val())
                arr.push(data)
                setInvoiceImg(arr[0])
                // invoiceImg.push(data)
                console.log("invcoieImages",invoiceImg,data)
            })
        }
        catch(error)
        {
            console.log(error)
        }
    }
    return(
        <div style={{
            display:'flex'
        }}>

        <div style={{
            height:130,
            gap:50
        }}>
            {
                invoices&&invoices.map((item,index)=>{
                    if(item.WeightType=='unit')
                    {
                        return(
<div style={{
    marginBottom:30
}}>
<span>Unit:{item.unit}</span><br/>
<span>Price:{item.price}</span><br/>
<span>Total:{convertIntoDoller(item.Total)}</span><br/>
<div style={{
        display:'flex',
        flexWrap:'wrap',
        marginRight:20,
        marginTop:20
    }} >
{
    invoiceImg.length!=0&&invoiceImg[parseInt(item.ID)-1].map(item=>{
        console.log(item)
        if(item)
        {
            return(
                <img src={item.url}  alt="BigCo Inc. logo" style={{width:100,height:100}}/>
            )
        }
    })
}
</div>
    </div>

                        )
                       

                    }
                    else {
                        return(
<div>
<span>GrossWeight:{item.grossWeight}</span><br/>
<span>TareWeight:{item.tareWeight}</span><br/>
<span>NetWeight:{item.netWeight}</span><br/>
<span>Price:{item.price}</span><br/>
<span>Total:{convertIntoDoller(item.Total)}</span><br/>
    <div style={{
        display:'flex',
        flexWrap:'wrap',
        marginRight:20,
        marginTop:20
    }} >
        {invoiceImg.length!=0&&invoiceImg[parseInt(item.ID)-1].map(item=>{
        console.log(item)
        if(item)
        {
            return(
                <img src={item.url}  alt="BigCo Inc. logo" style={{width:100,height:100}}/>
            )
        }
    })}
        </div>
    </div>
                        )
                    }
                })
            }
        </div>
        <div>
            
        </div>
        </div>

    )
}