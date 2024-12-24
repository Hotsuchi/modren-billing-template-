//  Select-dom

let body = document.querySelector('body'); 
let popupChild = document.querySelector('popup').children;
let main = document.querySelector('main');

// display/none

let homeDisply = ()=>{
    for(i=0;i<popupChild.length;i++){
        popupChild[i].style.display='none';
    }
    main.style.display='block';
}
let disply = (val)=>{
    let dply = '';
    for(i=0;i<popupChild.length;i++){
        (popupChild[i].className==val) ? dply='block' : dply='none';
        popupChild[i].style.display= dply;
        main.style.display='none';
    }
}

// Set LocalStroage Data
//profile data

document.querySelector('#profile-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    let profileObj = {
        brand_name: e.target.brand_name.value,
        brand_logo: e.target.brand_logo.value || 'logo.png',
        description: e.target.description.value || 'this is description',
        category: e.target.category.value || 'furniture',
    }
    localStorage.setItem('profile-data',JSON.stringify(profileObj));
    e.target.reset();
    showProfile();
    homeDisply();
})

// project data

document.querySelector('#project-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    let ls = JSON.parse(localStorage.getItem('project-data')) ?? [];
    ls.push({
        project_name: e.target.project_name.value,
        company_name: e.target.company_name.value || 'tk furniture',
        category: e.target.category.value || 'furniture',
        phone_no: e.target.phone_no.value || '8617711693',
        payment: e.target.payment.value || '0',
        item: [],
    })
    localStorage.setItem('project-data',JSON.stringify(ls));
    e.target.reset();
    showProject();
    homeDisply();
})

// set Item data

let setItemData = (val)=>{
    let itemName = document.querySelector('#item_name');
    let width = document.querySelector('#width');
    let height = document.querySelector('#height');
    let rate = document.querySelector('#rate');
    let qty = document.querySelector('#qty');
    
    let ls = JSON.parse(localStorage.getItem('project-data')) ?? [];
    ls[val].item.push({
        item_name: itemName.value,
        width: width.value,
        height: height.value,
        rate: rate.value || 300,
        qty: qty.value || 1,
    })
    localStorage.setItem('project-data', JSON.stringify(ls));
    itemName.value = '';
    width.value = '';
    height.value = '';
    rate.value = '';
    qty.value = '';
    homeDisply();
    console.table(ls[val].item);
}

// show data web-page
// profile data

let showProfile = ()=>{
    let brandName = document.querySelector('#brand-name');
    let ls = JSON.parse(localStorage.getItem('profile-data')) ?? [];
    brandName.innerText=ls.brand_name;
}
showProfile();
// project data
let showProject = ()=>{
    let projectList = document.querySelector('.project-list');
    let ls = JSON.parse(localStorage.getItem('project-data')) ?? [];
    let newProjectData = '';
    ls.forEach((v,i)=>{
        newProjectData += `<li>
                <p>${v.project_name}</p>
                <span>
                    <i class="fa-regular fa-eye" style="color:skyblue" onclick="showBill(${i})"></i>
                    <i class="fa-regular fa-pen-to-square" style="color:indigo"></i>
                    <i class="fa-solid fa-trash-can" style="color:red" onclick="deleteProject(${i})"></i>
                </span>
            </li>`;
    })
    projectList.innerHTML=newProjectData;
}
showProject();
// bill table view
let showBill = (val)=>{
    let billInfo = document.querySelector('#bill-info');
    let billTbody = document.querySelector('#bill-tbody');
    let billTfoot = document.querySelector('#bill-tfoot');
    let ls = JSON.parse(localStorage.getItem('project-data')) ?? [];
    let newBillData = '';
    let newBillTbody = '';
    let newBillTfoot = '';
    let total = 0;
    newBillData += `<th colspan="7">
                            <h2>${ls[val].project_name}</h2>
                            <p>${ls[val].company_name}</p>
                            <p>${ls[val].category}</p>
                            <p>${ls[val].phone_no}</p>
                        </th>`;
    ls[val].item.forEach((v,i)=>{
        total += v.width*v.height*v.rate*v.qty;
        newBillTbody += `<tr>
                        <th>${v.item_name}</th>
                        <th>${v.qty}</th>
                        <th>${v.width}</th>
                        <th>${v.height}</th>
                        <th>${v.width * v.height}</th>
                        <th>${v.rate}</th>
                        <th>${(v.width*v.height)*v.rate*v.qty}/-</th>
                    </tr>`;
    })
    newBillTfoot += `<tr>
                        <td colspan="2" rowspan="3">description</td>
                        <td colspan="2">total:</td>
                        <td colspan="3">${total}/-</td>
                    </tr>
                    <tr>
                        <td colspan="2">pay:</td> 
                        <td colspan="3">${ls[val].payment}/-</td> 
                    </tr> 
                    <tr>
                        <td colspan="2">balance:</td> 
                        <td colspan="3"> ${total-ls[val].payment}/-</td> 
                    </tr> 
                    <tr>
                        <td colspan="7"><button onclick="showAddItem(${val})">add new item</button></td> 
                    </tr>`;
    billInfo.innerHTML = newBillData;
    billTbody.innerHTML = newBillTbody;
    billTfoot.innerHTML = newBillTfoot;
    disply('bill');
}
// item show
let showAddItem = (val)=>{
    let addItemBtn = document.querySelector('#add-item-btn');
    addItemBtn.innerHTML = `<td colspan="4"><button onclick="setItemData(${val})">add</button></td>`;
    disply('add-item');
}
// Delete project List
let deleteProject = (val)=>{
    let ls = JSON.parse(localStorage.getItem('project-data')) ?? [];
    ls.splice(val,1);
    localStorage.setItem('project-data',JSON.stringify(ls));
    showProject();
}

// Page Download/Print
// kya print cdn include html page--confirm

window.onload = ()=>{
    document.querySelector('#print-btn').addEventListener('click',()=>{
        let bdy = document.querySelector('.bill');
        var opt = {
            margin: 1,
            filename: 'myfile.pdf',
            image: { type: 'pdf', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().from(bdy).set(opt).save();
    })
}



