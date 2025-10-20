import {subscribeToQueue} from './rabbit.js';
import sendEmail from '../utils/email.js';

function startListener(){

    subscribeToQueue("user_created",async (msg)=>{
        const {email, fullname:{firstName, lastName}, role} = msg;
        const template = `
        <h1>Welcome to Madmax</h1>
        <p>Dear ${firstName} ${lastName},</p>
        <p>Thank you for registering with Madmax. We are excited to have you on board.</p>
        <p>Your role is: ${role}</p>
        <p>We hope you enjoy using our services.</p>
        <br/>
        <p>Best regards,</p>
        <p>The Madmax Team</p>
        `
        await sendEmail(email, "Welcome to Madmax", "Thank you for registering with Madmax.", template);
    })
}

export default startListener;

