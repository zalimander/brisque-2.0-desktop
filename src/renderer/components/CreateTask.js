import React, { Component } from 'react'
import SegmentedControl from './SegmentedControl'
import Select from './Select';
import NumberStepper from './NumberStepper';
import ProfileSelector from './ProfileSelector';
import Checkbox from './Checkbox';
import Button from '~/components/Button';
import TextBox from './Textbox'
import styles from './ItemCreation.scss'
import RangeSlider from './RangeSlider'
import DatePicker from './DatePicker'

const categories = ['Jackets', 'Shirts', 'Tops/Sweaters', 'Sweatshirts', 'Pants', 'Shorts', 'T-Shirts', 'Hats', 'Bags', 'Accessories', 'Skate'].map(item => ({ item }))

export default class CreateTask extends Component {
  
  state = {
    category: ''
  }
  
  get itemPage() {
    const { category } = this.state
    
    return (
      <div>
        <div className={styles.row}>
          <Select options={ categories } title='category' placeholder='Select Category' value={ category } onChange={ cat => this.setState({ category: cat }) } fixed/>
          <NumberStepper title='item quantity'/>
        </div>
        <div className={styles.row}>
          <Select multiple={true} options={ [{ item: 'hi' }] } title='keywords' placeholder='Select Keywords'/>
        </div>
        <div className={styles.row}>
          <Select multiple={true} options={ [{ item: 'hi' }] } title='colors' placeholder='Select Colors'/>
          <Select multiple={true} options={ [{ item: 'hi' }] } title='sizes' placeholder='Select Sizes'/>
        </div>
        <div className={styles.row}>
          <ProfileSelector title='profile'/>
        </div>
        <div className={styles.row}>
          <Checkbox text='Use In-Store Credit' checked={ false } onChange={ () => {} }/>
        </div>
        <div className={styles.row}>
          <Button style={{height:50,fontSize:'18px',marginTop:'10px'}} type='disabled'>Next</Button>
        </div>
      </div>
    )
  }
  
  get taskPage() {
    return (
      <div>
        <div className={styles.row}>
          <TextBox title='checkout delay' placeholder='1000'/>
          <DatePicker  title='start time' placeholder='Manual'/>
        </div>
        <div className={styles.row}>
          <RangeSlider title='captcha priority' leftTitle={'none'} rightTitle={'first'} value={0} min={0} max={50}/>
        </div>
        <div className={styles.row}>
          <Select options={ [{ item: 'hi' },{item:'hi again'}] } title='proxy' placeholder='Select Proxy'/>
          <NumberStepper title='task quantity'/>
        </div>
        <div className={styles.row}>
          <Button style={{height:50,fontSize:'18px',marginTop:'10px'}} type='success'>Create Task</Button>
        </div>
      </div>
    )
  }
  
  render() {
    return (
      <SegmentedControl
        width={425}
        title='New Task'
        segments={ [{
          title: 'Product & Billing',
          component: this.itemPage
        }, {
          title: 'Task Settings',
          component: this.taskPage
        }] }
      />
    )
  }
  
}
