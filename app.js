//budget module 
var budgetController = (function(){
  
      var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
      };
      Expense.prototype.calcPercentage =function(totalIncome){
       if(totalIncome>0)
        this.percentage = Math.round((this.value / totalIncome)*100);
        else 
        this.percentage= -1 ;
      };
      Expense.prototype.getPercentage = function(){
          return this.percentage;
      };

      var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
      };
      //data 
     
       var data ={
           allItems:{
               exp: [],
               inc:[]
           },
           totals:{
               exp:0,
               inc:0
           },
           budget:0,
           percentage: -1
       }
      
       calculateTotal= function(type){
        var sum = 0;
        data.allItems[type].forEach(element => {
             sum += element.value;
        });
        data.totals[type] = sum;
       };
         
       return{

           addItem: function(type,des,val){
               var newItem,ID;
            
            //create new ID 
                if(data.allItems[type].length > 0)
                ID=data.allItems[type][data.allItems[type].length -1].id + 1;
                else 
                ID =0;
     
            //create new item based on 'inc' or 'exp'
                if(type === 'inc'){
                    newItem=  new Income(ID,des,val);
                }else if(type === 'exp'){
                    newItem= new Expense(ID,des,val);                  
                }
            //push the data to our datastructur
              data.allItems[type][ID]=newItem;
            //return our new data 
              return newItem;

           },

           deleteItem: function(type,id){
               
                var ids,index;

                ids=data.allItems[type].map(function(current){
                    return current.id;
                });

                index=ids.indexOf(id);

                if(index !== -1){
                    data.allItems[type].splice(index,1);
               
                }
                console.log(data);
               

           },
 
           getBudget: function(){
            
               return {
                   budget: data.budget,
                   totalInc: data.totals.inc,
                   totalExp: data.totals.exp,
                   percentage: data.percentage
               }
           },
           calculateBudget: function(){
                //calculate total income and expense 
               calculateTotal('exp');
               calculateTotal('inc');

                //calculate the budget 
                data.budget = data.totals.inc - data.totals.exp;

                //calculate the % of the income 
                if(data.totals.inc > 0)
                data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);

           },
           calculatePercentages:function(){
                data.allItems.exp.forEach(function(current){
                    current.calcPercentage(data.totals.inc);
                });
           },
           getPercentages:function(){
               var allPerc = data.allItems.exp.map(function(current){
                   return current.getPercentage();
               });
               return allPerc;
           }
           

       }
     
})();
//ui module 
var UIController =(function(){
      var DOMstrings = {
          inputType :'.add__type',
          inputDescription : '.add__description',
          inputValue : '.add__value',
          inputBtn: '.add__btn',
          incomeContainer: '.income__list',
          expenseContainer: '.expenses__list',
          budgetLabel: '.budget__value',
          incomeLabel: '.budget__income--value',
          expensesLabel: '.budget__expenses--value',
          percentageLabel:'.budget__expenses--percentage' ,
          container: '.container',
          expensesPercLabel:'item__percentage',
          monthLabel:'.budget__title--month'

      };



    var  formatNumber = function(num,type){
          var numSplit, int ,dec;
          num =Math.abs(num);
          num = num.toFixed(2);

          numSplit = num.split('.');

          int=numSplit[0];
          dec=numSplit[1];
          if(int.length > 3){
              int = int.substr(0,int.length -3)+','+int.substr(int.length-3,3);
          }
          
          return (type === 'exp' ? '-':'+')+int+'.'+dec;
    };
      
   
    return {    
        getinput: function(){
                return {
                         type : document.querySelector(DOMstrings.inputType).value , 
                         description : document.querySelector(DOMstrings.inputDescription).value,
                         value :parseFloat(document.querySelector(DOMstrings.inputValue).value)
                      }
        },
        clearFields: function(){
          var focusItem;
             focusItem = document.querySelector(DOMstrings.inputDescription);
             focusItem.value='';
            document.querySelector(DOMstrings.inputValue).value='';
            focusItem.focus();
            
        },
        addListItem: function(obj,type){
            var html,newHtml,element;

         if(type === 'inc'){
        
            element =  DOMstrings.incomeContainer;
            html =  '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        
        }else if(type === 'exp'){

            element = DOMstrings.expenseContainer;
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
       
        }

         //replacing the string 
        newHtml = html.replace('%id%',obj.id);
        newHtml = newHtml.replace('%description%',obj.description);
        newHtml = newHtml.replace('%value%',formatNumber(obj.value,type));
   
        //inserting to the DOM  
        document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
   
    },
    deleteListItem: function(selectorID){
        var element = document.getElementById(selectorID);
        element.parentNode.removeChild(element);
        // document.querySelector('#'+selectorID).remove();   i think l used jquery accedintly 
    },
    displayBudget: function(inputBudget){
        var type = (inputBudget.budget > 0? 'inc':'exp');
        console.log(type);
        document.querySelector(DOMstrings.budgetLabel).innerText = formatNumber(inputBudget.budget,type);
        document.querySelector(DOMstrings.incomeLabel).innerText = formatNumber(inputBudget.totalInc,'inc');
        document.querySelector(DOMstrings.expensesLabel).innerText = formatNumber(inputBudget.totalExp,'exp');
        if(inputBudget.percentage > 0)
        document.querySelector(DOMstrings.percentageLabel).innerText = inputBudget.percentage+'%';
        else 
        document.querySelector(DOMstrings.percentageLabel).innerText = '---';


    },


        getDOMstrings: function(){
            return DOMstrings;

        },
        displayPercentages: function(percArray){
            percArray.forEach(function(curr,index,per){
                if(per[index] > 0)
               document.getElementsByClassName(DOMstrings.expensesPercLabel)[index].innerHTML = per[index]+'%';  
                else
                document.getElementsByClassName(DOMstrings.expensesPercLabel)[index].innerHTML = '---';  

            })
           
        },
        displayMonth: function(){
            var months;
            var now =new Date();
            months=['January','February','March','April','May','June','July','August','September','October','November','December']
            document.querySelector(DOMstrings.monthLabel).textContent= months[now.getMonth()];
        
        },
        changedType: function(){
            var fields = document.querySelectorAll(
                DOMstrings.inputType+','+
                DOMstrings.inputDescription + ','+
                DOMstrings.inputValue);
                for(var i = 0 ;i< fields.length ;i++){
                    fields[i].classList.toggle('red-focus');
                }
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
            
        }
    }


})();
//controller module
var controller = (function(budgetCtrl,UICtrl){


     var updateBudget = function(){
       var budget;
         //1.calculate the budget 
         budgetCtrl.calculateBudget();
              
         //2.return the budget 
        budget = budgetCtrl.getBudget();

        

         //3.call display budget from UI Ctrl
         UICtrl.displayBudget(budget);
     };


     var updatePercentages=function(){
         var totalbudget ;
        //1.calculate the percentage 
        budgetCtrl.calculatePercentages();

        //2.read percentages from the budget controller 
        totalbudget = budgetCtrl.getPercentages(); 

        //3.update the UI with the new percentages 
     
        UICtrl.displayPercentages(totalbudget);
     };


    

     var ctrAddItem = function(){

         var input,newItem;

      //1.get the filed input data 
       input = UICtrl.getinput();
       //check if the data is write  
        if(input.description ==='' || isNaN(input.value) || input.value <= 0)
        return;
        
        
      
      //2.pass data to budget controller
       newItem = budgetCtrl.addItem(input.type,input.description,input.value);
      
      //3.add the item to UI
      UICtrl.addListItem(newItem,input.type); 
      
      //4.clear the UI
      UICtrl.clearFields();

      //5.calculate and update budget 
      updateBudget();

      //6.calculate and update percentages 
      updatePercentages();
          
    
    };
    var ctrlDeleteItem=function(oEvent){
        var itemID,splitID, type ,ID; 
        itemID = oEvent.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            splitID=itemID.split('-');
            type=splitID[0];
            ID=parseInt(splitID[1]);
        
              //delete the item from the data structure 
             budgetCtrl.deleteItem(type,ID);
              //delete the item from the UI 
            UICtrl.deleteListItem(itemID);
              //update and show the budget 
            updateBudget();

          //calculate and update percentages 
         updatePercentages();
      
        }
  
    };


var setupEventListeners = function(){
    var DOMstrings = UICtrl.getDOMstrings();
    document.querySelector(DOMstrings.inputBtn).addEventListener('click',ctrAddItem);
    document.addEventListener('keypress',function(oEvent){
             if(oEvent.keyCode === 13 || oEvent.which === 13){
                 ctrAddItem();
             }
        });

   document.querySelector(DOMstrings.container).addEventListener('click',ctrlDeleteItem);
   document.querySelector(DOMstrings.inputType).addEventListener('change',UICtrl.changedType);
    };

    
    return {
        init : function(){
        //display the month 
        UICtrl.displayMonth();
        //event listener
            setupEventListeners();
       //display budget's 
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
        }
    }
    
})(budgetController,UIController);

controller.init();