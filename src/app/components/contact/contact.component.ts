import { Component, ElementRef, ViewChild } from '@angular/core';
import emailjs from 'emailjs-com';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

  @ViewChild('contactFormRef') contactFormRef!: ElementRef<HTMLFormElement>;
  isSending = false;

  constructor(private snackBar: MatSnackBar) { }

  sendEmail() {
    if (!this.contactFormRef) return;

    this.isSending = true;

    const formEl = this.contactFormRef.nativeElement;

    // STEP 1: Send the form to you (site owner)
    emailjs.sendForm(
      'service_ynuyulv',
      'template_zf4ywg8',
      formEl,
      'WNzMFzVDbgQUNalPA'
    ).then(() => {

      const name = formEl.querySelector<HTMLInputElement>('[name="from_name"]')?.value || '';
      const email = formEl.querySelector<HTMLInputElement>('[name="from_email"]')?.value || '';
      const subject = formEl.querySelector<HTMLInputElement>('[name="subject"]')?.value || '';
      const message = formEl.querySelector<HTMLTextAreaElement>('[name="meassage"]')?.value || '';

      // STEP 2: Send auto-reply to customer
      return emailjs.send(
        'service_ynuyulv',
        'template_rlkw1ph',
        { name, email, subject, message },
        'WNzMFzVDbgQUNalPA'
      );

    }).then(() => {
      this.snackBar.open('✅ Message sent successfully!', 'Close', {
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['success-snackbar'],
      });
      formEl.reset();
      this.isSending = false;

    }).catch((error) => {
      console.error('Email sending error:', error);
      this.snackBar.open('❌ Failed to send message.', 'Close', {
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
      this.isSending = false;
    });
  }

}
