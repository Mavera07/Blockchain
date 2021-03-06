pragma solidity ^0.4.11;

library IterableMapping {
    struct itmap {
        mapping(address => IndexValue) data;
        KeyFlag[] keys;
        uint size;
    }
    struct IndexValue { uint keyIndex; uint value; }
    struct KeyFlag { address key; bool deleted; }
    
    function insert(itmap storage self, address key, uint value) 
        returns (bool replaced) {
            uint keyIndex = self.data[key].keyIndex;
            self.data[key].value = value;
            if (keyIndex > 0)
                return true;
            else
            {
                keyIndex = self.keys.length++;
                self.data[key].keyIndex = keyIndex + 1;
                self.keys[keyIndex].key = key;
                self.size++;
                return false;
            }
    }
    function remove(itmap storage self, address key) 
        returns (bool success) {
            uint keyIndex = self.data[key].keyIndex;
            if (keyIndex == 0)
                return false;
            delete self.data[key];
            self.keys[keyIndex - 1].deleted = true;
            self.size --;
    }
    
    function contains(itmap storage self, address key) 
        returns (bool) {return self.data[key].keyIndex > 0;}
    function iterate_start(itmap storage self) 
        returns (uint keyIndex){return iterate_next(self, uint(-1));}
    function iterate_valid(itmap storage self, uint keyIndex) 
        returns (bool){return keyIndex < self.keys.length;}
    
    function iterate_next(itmap storage self, uint keyIndex) 
        returns (uint r_keyIndex){
            keyIndex++;
            while (keyIndex < self.keys.length && self.keys[keyIndex].deleted)
                keyIndex++;
            return keyIndex;
    }
    function iterate_get(itmap storage self, uint keyIndex) 
        returns (address key, uint value){
            key = self.keys[keyIndex].key;
            value = self.data[key].value;
    }
}


contract SSInsurance {
    
    struct Customer {   
        address owner;  
        uint endDate;
        uint remaining;
    }   
    
    struct Hospital {   
        address owner;  
        uint endDate;
        uint treatingCost;
    }   
    
    struct Statistics {
        uint noCustomer;
        uint noHospital;
    }
    
    
    mapping(address => Customer) customers;
    IterableMapping.itmap customerAddresses;
    mapping(address => Hospital) hospitals;
    IterableMapping.itmap hospitalAddresses;
    Statistics statistics;
    
    
    
    // Customer API Call
    // This function takes parameters from customers; duration and payment.
    // From the desired insurance duration and desired insurance payment,
    // it calculates a multiplier number, in other words insurance note
    // With this number, insurance limit will be calculated.
    // insurance limit = payment * multiplier / 100
    function getInsuranceNote(uint duration)
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
        for( var i = IterableMapping.iterate_start(hospitalAddresses); IterableMapping.iterate_valid(hospitalAddresses, i); i = IterableMapping.iterate_next(hospitalAddresses, i)) {
        var (key, value) = IterableMapping.iterate_get(hospitalAddresses, i);
        if(hospitals[key].endDate < now) {
            IterableMapping.remove(hospitalAddresses, key);
            delete hospitals[key]; // may be a problem?
        }
        }
        statistics.noHospital =  hospitalAddresses.size;
            hospitalNumber = statistics.noHospital;
    }
    
    // Customer API Call
    // This function is for the insurance payment
    // Customers call this function to buy an insurance
    function payInsurance(uint duration) payable{
        require(customers[msg.sender].endDate < now);
        IterableMapping.insert(customerAddresses, msg.sender, 10); // 10 for customer value...
        
        customers[msg.sender].endDate = now + ( duration * 1 minutes );
        // statistics.noCustomer = statistics.noCustomer + 1; 
        
        uint mult = getInsuranceNote(duration);
        customers[msg.sender].remaining = msg.value*mult/100;
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
            require(hospitals[msg.sender].endDate < now);
        getHospitalNumber();
        getCustomerNumber();
            
            uint noCust = statistics.noCustomer;
            uint noHost = statistics.noHospital;
            
            uint duration = 12;
            uint hospitalProfit = noCust * 6 / 10 *treatingCost * 6 / 10;
            
            uint sharePercent = 0;
            if(noHost < 10){
                sharePercent = 20 + (40 - 20) * noHost / 10;
            }else if(noHost < 100){
                sharePercent = 40 + (50 - 40) * (noHost-10) / (100 - 10);
            }else if(noHost < 150){
                sharePercent = 50 - (50 - 30) * (noHost-100) / (150 - 100);
            }else{
                sharePercent = 30;
            }
        
            uint desiredGain = hospitalProfit * sharePercent / 100;
            
            require(desiredGain <= msg.value);
        IterableMapping.insert(hospitalAddresses, msg.sender, 20); // 20 for hospitals...
            
            hospitals[msg.sender].endDate = now + duration * ( 1 minutes ); 
            // statistics.noHospital = noHost + 1;
            hospitals[msg.sender].treatingCost = treatingCost;
            
            return true;
        
    }
    
    // Hospital API Call
    // This function returns the number of customers that have
    // contract with our insurance company.
    function getCustomerNumber ()
        returns (uint customerNumber){
        for( var i = IterableMapping.iterate_start(customerAddresses); IterableMapping.iterate_valid(customerAddresses, i); i = IterableMapping.iterate_next(customerAddresses, i)) {
        var (key, value) = IterableMapping.iterate_get(customerAddresses, i);
        if(customers[key].endDate < now) {
            IterableMapping.remove(customerAddresses, key);
            delete customers[key]; // may be a problem?
        }
        }
        statistics.noCustomer =  customerAddresses.size;
            customerNumber = statistics.noCustomer;
    }
    
    
    
    // Customer API Call
    // Hospital gets money from our insurance company for treaing a customer
    // Customer must run this code to be treated by the hospital
    // Hospital will not treat the customer before the customer run this function
    function  withdraw(address host1)
        returns (bool){
            require(customers[msg.sender].endDate > now);
            require(hospitals[host1].endDate > now);
            require(customers[msg.sender].remaining >= hospitals[host1].treatingCost);
            
            msg.sender.transfer(hospitals[host1].treatingCost);
            customers[msg.sender].remaining = customers[msg.sender].remaining - hospitals[host1].treatingCost;
    }
    
    
}
