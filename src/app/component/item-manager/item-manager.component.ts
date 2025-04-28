import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../model/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-item-manager',
  imports: [ReactiveFormsModule],
  templateUrl: './item-manager.component.html',
  styleUrl: './item-manager.component.css'
})
export class ItemManagerComponent implements OnInit{
  @ViewChild('myModal') modal : ElementRef | undefined;
  productForm : FormGroup = new FormGroup({});
  productList: Product[] = [];
  prodService = inject(ProductService);
  isEditMode: boolean = false;
  
  constructor(private fb:FormBuilder) {
  }

  ngOnInit(): void {
    this.setFormState();
    this.getProduct();
  }

  openModal()
  {
    console.log("openModal called");
    const prodModal = document.getElementById("myModal");
    if (prodModal) {
      prodModal.style.display = "block";
    }
  }

  closeModal()
  {
    console.log("closeModal called");
    if (this.modal != null)
    {
      this.setFormState(); // Reset form state
      this.modal.nativeElement.style.display = "none";
    }
  }

  setFormState()
  {
    this.isEditMode = false; // Reset edit mode
    this.productForm = this.fb.group({
      id:[0],
      ProductName:['', [Validators.required]],
      Price:['', [Validators.required]],
      Description:['', [Validators.required]],
      Rating:['', [Validators.required]],
      Status: [false, [Validators.required]],
    });
  }

  onSubmit()
  {
    console.log('Form Values:', this.productForm.value);
    if(this.productForm.invalid)
    {
      alert("Please fill all the required fields.");
      return;
    }

    if (this.isEditMode) {
      // Update product
      const productId = this.productForm.value.id;
      this.prodService.updateProduct(productId, this.productForm.value).subscribe((res) => {
        alert("Product updated successfully.");
        this.getProduct();
        this.setFormState(); // Reset form state
        this.closeModal();
      });
    } else {
      // Add product
      this.prodService.addProduct(this.productForm.value).subscribe((res) => {
        alert("Product added successfully.");
        this.getProduct();
        this.setFormState(); // Reset form state
        this.closeModal();
      });
    }
  }

  getProduct() {
    this.prodService.getAllProducts().subscribe((res)=>{
      this.productList = res;
      console.log(this.productList);
    })
  }

  onDelete(id: number) {
    const confirmDelete = confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      this.prodService.deleteProduct(id).subscribe((res) => {
        alert("Product deleted successfully.");
        this.getProduct();
      });
    }
    else {
      alert("Product not deleted.");
    }
  }

  onEdit(product: Product) {
    this.isEditMode = true; // Set edit mode
    this.productForm.patchValue({
      id: product.id,
      ProductName: product.productName,
      Price: product.price,
      Description: product.description,
      Rating: product.rating,
      Status: product.status
    });
    this.openModal();
  }
}