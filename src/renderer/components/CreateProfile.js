import React, { Component } from 'react'
import SegmentedControl from './SegmentedControl'
import Select from './Select';
import Checkbox from './Checkbox';
import Button from '~/components/Button';
import TextBox from './Textbox'
import styles from './ItemCreation.scss'
import ProfileDesigner from './ProfileDesigner'

export default class CreateProfile extends Component {
  
  get billingPage() {
    return (
      <div>
        <div className={styles.row}>
          <Checkbox text='Use Catch-All Domain' checked={ false } onChange={ () => {} }/>
        </div>
        <div className={styles.row}>
          <TextBox placeholder='E-Mail Address'/>
        </div>
        <div className={styles.row}>
          <TextBox placeholder='Phone Number'/>
        </div>
        <div className={styles.row}>
          <TextBox placeholder='First Name'/>
          <TextBox placeholder='Last Name'/>
        </div>
        <div className={styles.row}>
          <Select options={ [{ item: 'hi' },{item:'hi again'}] } placeholder='Country'/>
          <Select options={ [{ item: 'hi' },{item:'hi again'}] } placeholder='State'/>
        </div>
        <div className={styles.row}>
          <TextBox placeholder='Address 1'/>
        </div>
        <div className={styles.row}>
          <TextBox placeholder='Address 2'/>
        </div>
        <div className={styles.row}>
          <TextBox placeholder='City'/>
          <TextBox placeholder='ZIP Code'/>
        </div>
        <div className={styles.row}>
          <Button style={{height:50,fontSize:'18px',marginTop:'10px'}} type='success'>Next</Button>
        </div>
      </div>
    )
  }
  
  get shippingPage() {
    return (
      <div>
        <div className={styles.row}>
          <Checkbox text='Same as Billing' checked={ false } onChange={ () => {} }/>
        </div>
        <div className={styles.row}>
          <TextBox placeholder='E-Mail Address'/>
        </div>
        <div className={styles.row}>
          <TextBox placeholder='Phone Number'/>
        </div>
        <div className={styles.row}>
          <TextBox placeholder='First Name'/>
          <TextBox placeholder='Last Name'/>
        </div>
        <div className={styles.row}>
          <Select options={ [{ item: 'hi' },{item:'hi again'}] } placeholder='Country'/>
          <Select options={ [{ item: 'hi' },{item:'hi again'}] } placeholder='State'/>
        </div>
        <div className={styles.row}>
          <TextBox placeholder='Address 1'/>
        </div>
        <div className={styles.row}>
          <TextBox placeholder='Address 2'/>
        </div>
        <div className={styles.row}>
          <TextBox placeholder='City'/>
          <TextBox placeholder='ZIP Code'/>
        </div>
        <div className={styles.row}>
          <Button style={{height:50,fontSize:'18px',marginTop:'10px'}} type='success'>Next</Button>
        </div>
      </div>
    )
  }

  get paymentPage() {
    return (
      <div>
        <div className={styles.row}>
          <ProfileDesigner/>
        </div>
        <div className={styles.row}>
          <TextBox title= 'profile title' placeholder='My Profile'/>
        </div>
        <div className={styles.row}>
          <TextBox title= 'card number' placeholder='0000 0000 0000 0000'/>
        </div>
        <div className={styles.row}>
          <TextBox title= 'EXP. Date' placeholder='MM/YY'/>
          <TextBox title= 'CVV' placeholder='000'/>
        </div>
        <div className={styles.row}>
          <Button style={{height:50,fontSize:'18px',marginTop:'10px'}} type='success'>Create Profile</Button>
        </div>
      </div>
    )
  }
  
  render() {
    return (
      <SegmentedControl
        width = {375}
        title='New Profile'
        segments={ [{
          title: 'Billing',
          component: this.billingPage
        }, {
          title: 'Shipping',
          component: this.shippingPage
        }, {
          title: 'Payment',
          component: this.paymentPage
        }] }
      />
    )
  }
  
}
