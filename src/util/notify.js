import { css } from '@emotion/react';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()
const config={
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    background:'red',
    className: 'toast',
    toast: css({
        color: '#343a40',
        minHeight: '60px',
        borderRadius: '8px',
        background: '#2FEDAD',
        boxShadow: '2px 2px 20px 2px rgba(0,0,0,0.3)'
      }),
      // progressClassName: css({
      //   background: '#007aff'
      // })
    }
  export const notify = (message,type)=>{
    switch (type) {
        case 1:
           toast.success(message,config);
            break;
            case 0:
            toast.error(message,config);
            break;
             case 3:
           toast.info(message,config);
            break;
            case 2:
            toast.warning(message,config)
            break;
        default:
            toast.success(message,config);
            break;
    }
  }