pragma solidity ^0.4.11;

contract SSInsurance {
    
    struct Customer {   
        address owner;  
        uint endDate;
        bool isPaid;
        uint limit;
        uint remaining;
    }   
    
    struct Hospital {   
        address owner;  
        uint endDate;
        bool isPaid;
        uint treatingCost;
    }   
    
    struct Statistics {
        uint noCustomer;
        uint noHospital;
    }
    
    
    mapping(address => Customer) customers;
    mapping(address => Hospital) hospitals;
    Statistics statistics;
    
    
    
    // Customer API Call
    // This function takes parameters from customers; duration and payment.
    // From the desired insurance duration and desired insurance payment,
    // it calculates a multiplier number, in other words insurance note
    // With this number, insurance limit will be calculated.
    // insurance limit = payment * multiplier / 100
    function getInsuranceNote(address cust1,uint duration,uint payment)
        returns (uint multiplier){
            
        if(duration <= 12){
            multiplier =  400 - (400 - 300) * (duration - 0) / (12 - 0);
        }else if (duration <= 24){
            multiplier = 300 - (300 - 240) * (duration -12) / (24 - 12);
        }else if (duration <= 36){
            multiplier = 240 - (240 - 200) * (duration -24) / (36 - 24);
        }else if (duration <= 60){
            multiplier = 200 - (200 - 140) * (duration -36) / (60 - 36);
        }else{
            multiplier = 140;
        }
        
    }
    
    // Customer API Call
    // This function returns the number of hospitals that have contract
    // with our insurance company
    function getHospitalNumber()
        constant returns (uint hospitalNumber){
            hospitalNumber = statistics.noHospital;
    }
    
    // Customer API Call
    // This function is for the insurance payment
    // Customers call this function to buy an insurance
    function payInsurance(uint duration) payable{
        require(!customers[msg.sender].isPaid);
        
        customers[msg.sender].endDate = now + ( duration * 1 minutes );
        customers[msg.sender].isPaid = true;
        statistics.noCustomer = statistics.noCustomer + 1; 
        
        uint mult = getInsuranceNote(msg.sender,duration,msg.value);
        customers[msg.sender].limit = msg.value*mult/100;
        customers[msg.sender].remaining = 0;
    }
    
    // Hospital API Call
    // Hospital makes an offer to our insurance company
    // Hospital defines a treatingCost and pays money to our insurance company
    // The function calculates an expected/desired payment from several parameters
    // It takes into account the number of customers that have contract with our insurance company
    // and the number of hospitals that have contract with our insurance company and the treatingCost
    // If the calculated value is less than the value that hospital offers,
    // then the offer got accepted and hospital have an contract with our company and become active
    function hospitalOffer (uint treatingCost) payable
        returns (bool){
            require(!hospitals[msg.sender].isPaid);
            
            uint duration = 12;
            uint hospitalProfit = statistics.noCustomer * 6 / 10 *treatingCost * 6 / 10;
            
            uint sharePercent = 0;
            if(statistics.noHospital < 10){
                sharePercent = 20 + (40 - 20) * statistics.noHospital / 10;
            }else if(statistics.noHospital < 100){
                sharePercent = 40 + (50 - 40) * (statistics.noHospital-10) / (100 - 10);
            }else if(statistics.noHospital < 150){
                sharePercent = 50 - (50 - 30) * (statistics.noHospital-100) / (150 - 100);
            }else{
                sharePercent = 30;
            }
        
            uint desiredGain = hospitalProfit * sharePercent / 100;
            
            require(desiredGain <= msg.value);
            
            hospitals[msg.sender].endDate = now + duration * ( 1 minutes ); 
            hospitals[msg.sender].isPaid = true;
            statistics.noHospital = statistics.noHospital + 1;
            hospitals[msg.sender].treatingCost = treatingCost;
            
            return true;
        
    }
    
    // Hospital API Call
    // This function returns the number of customers that have
    // contract with our insurance company.
    function getCustomerNumber ()
        returns (uint customerNumber){
            customerNumber = statistics.noCustomer;
    }
    
    
    
    // Customer API Call
    // Hospital gets money from our insurance company for treaing a customer
    // Customer must run this code to be treated by the hospital
    // Hospital will not treat the customer before the customer run this function
    function  withdraw(address host1)
        returns (bool){
            require(customers[msg.sender].isPaid);
            require(hospitals[host1].isPaid);
            require(customers[msg.sender].remaining >= hospitals[host1].treatingCost);
            
            msg.sender.send(hospitals[host1].treatingCost);
            customers[msg.sender].remaining = customers[msg.sender].remaining - hospitals[host1].treatingCost;
    }
    
    // TODO
    // Check date for updating isPaid
    
    
}
