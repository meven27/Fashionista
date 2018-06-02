import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '../_models/index';
import { AlertService, UserService } from '../_services/index';
import { Product } from '../_models/index';
import { ProductService } from '../_services/index';


@Component({
  moduleId: module.id,
  templateUrl: 'basket.component.html',
  styleUrls: [
      '../css/style.default.css',
      '../css/font-awesome.css',
      '../css/animate.min.css',
      '../css/owl.theme.css',
      '../css/custom.css'
  ]
})
export class BasketComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;
  currentUser: User;
  users: User[] = [];
  products : Product[] = [];
  appState = 'default';
  op : number = 0; // ordr price with shipping
  fp : number = 0; //final price of component
  totalPrice : number = 0 ;
 
  
  paymentOrderPrice :number = 10;
  @Output() onPayment = new EventEmitter<number>();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService, private productService: ProductService,
    private router: Router, private alertService: AlertService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
   }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.loadAllUsers();
    this.finalPrice();
    this.orderSummary();
  }
   loadAllUsers() {
    
    //load all users and their cart items
    this.userService.getAll().subscribe(users => { this.users = users; });
  }

  finalPrice(){
   
    var userCartLength= this.currentUser.cart.length;
    //calculate the total price of the items in users cart

    for(var i=0; i <userCartLength; i++ ){
       this.totalPrice += Number(this.currentUser.cart[i].productPrice); 
    }
    this.op = this.totalPrice;
    
  }

  orderSummary(){
    //display the order summary with shipping
      var orderPrice = 0;
      orderPrice = this.totalPrice;
      this.op = orderPrice;
      //Adding the shipping details
      this.fp = orderPrice + this.paymentOrderPrice;
      
  }
  orderDiscount(){
   // calculate the discount 
   //alert(this.model.item.cartQuantity);
   this.totalPrice = this.totalPrice - ( (this.totalPrice * 0.50) );
    
    this.orderSummary();
    
  }

  cartObjectDelete(product: Product , user : User)
  {        
      this.appState='edit';
      this.userService.update(product , user)
      .subscribe(
          data => {
              this.alertService.success('Product Deleted from Cart Successfully !', true);
              //this.userService.getAll().subscribe(users => { this.users = users; });
          },
          error => {
              this.alertService.error(error);
          });
  }
    
  
    proPayment(paymentPrice : number){
         // alert(paymentPrice);
          this.onPayment.emit(paymentPrice);

    }
    finalPaymentCartDelete(users :User){
      this.appState='edit';
      
      this.userService.updatFinalCart(users)
      .subscribe(
          data => {
               this.alertService.success('Transaction Done !!', true);
               this.loadAllUsers();
          },
         
          error => {
             this.alertService.error(error);
          });

    }
    


  
}
