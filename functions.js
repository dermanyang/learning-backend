module.exports = {

  // Find the company that has the largest single amount of money invested. In this
  // case, we are not looking for the sum of all investments made on a company. But
  // the largest sum invested by one investor.
  // You should iterate over the array of investments and find out the single largest
  // "original investment" made on a company.
  // Return the amount of the largest investment.
  singleLargestInvestment: function(arr){
    var largestInvestmentIndex = 0;
    var largestInvestment = -Infinity;
    for (var x in arr){
      if (arr[x].originalInvestment > largestInvestment){
        largestInvestmentIndex = x;
        largestInvestment = arr[x].originalInvestment;
      }
    }
    return arr[largestInvestmentIndex].originalInvestment;
  },

  // Find the average of all the original investments for all companies.
  // This is equal to the sum of all the original investments divided by the number
  // of investments.
  // Return a Number.
  averageOfOriginalInvestments: function(arr){
    var total = 0;
    for (var x in arr){
      total += arr[x].originalInvestment;
    }
    return (total/arr.length)
  },

  // Find out how much a company got as the original investments. In this case, You
  // will have to iterate over the companies and find all the investments for each
  // company and add them up to find how much money they started with.
  // Return an object that contains company ids as keys and their total original investment
  // as values. The object's structure should look something like this:
  // {
  //  1: 595000,
  //  2: 1024000,
  //   ...
  // }
  totalOriginalInvestmentForCompanies: function(arr){
    // Fields to be parsed: "originalInvestment", "valueToday"
    var returnObj = {};

    for (var x in arr){
      var companyID = arr[x].company;


      if (returnObj[companyID] == undefined){

          //add to object
          returnObj[companyID] = arr[x].originalInvestment;
      }
      else{
        returnObj[companyID] += arr[x].originalInvestment;
      }
    }

    return returnObj;
  },

  // Find out how much money an investor spent as  original investments. You will
  // need to iterate through all the investments, find all the investments for each
  // investor and add them up to find how much money someone invested at the beginning.
  // Return an object that contains investor ids as keys and their total original investment
  // as values.  The object's structure should look something like this:
  // {
  //  1: 595000,
  //  2: 1024000,
  //   ...
  // }
  totalOriginalInvestmentsByInvestors: function(arr){
    var returnObj = {};

    for (var x in arr){
      var investorId = arr[x].investorId;

      if (returnObj[investorId] == undefined){

          //add to object
          returnObj[investorId] = arr[x].originalInvestment;
      }
      else{
        returnObj[investorId] += arr[x].originalInvestment;
      }
    }

    return returnObj;
  },

  // This function is similar to the one above, but it returns the current value
  // for each investor. To get this value, you need to iterate through all the investments,
  // find all the currentValues for each investor and add them up to find how much
  // money someone has now from their investment
  // Return an object that contains investor ids as keys and their total todayValue
  // as values. The object's structure should look something like this:
  // {
  //  1: 595000,
  //  2: 1024000,
  //   ...
  // }
    // Fields to be parsed: "originalInvestment", "valueToday"
  totalCurrentValueOfInvestors: function(arr){
    var returnObj = {};

    for (var x in arr){
      var investorId = arr[x].investorId;


      if (returnObj[investorId] == undefined){

          //add to object
          returnObj[investorId] = arr[x].valueToday;
      }
      else{
        returnObj[investorId] += arr[x].valueToday;
      }
    }

    return returnObj;
  },

  // To find out who the best investor is, you need to find out the ratio in which
  // they made money. If they invested 100 and their todayValue is 200, they made
  // 2x their investment. Calculate this for all investors and figure out who the
  // best one is!
  // Note: Remember to use their total of investments and the total of current value:
  // using totalOriginalInvestmentsByInvestors & totalCurrentValueOfInvestors
  // Return an investorID;
  bestInvestorByValueIncrease: function(arr){
    var bestInvestor = 0;
    var bestroi = -Infinity;
    var origValue = this.totalOriginalInvestmentsByInvestors(arr);
    var curValue = this.totalCurrentValueOfInvestors(arr);
    console.log(origValue);
    console.log(curValue);

    for (var x in origValue){
      console.log(x)
      if (curValue[x]/origValue[x] > bestroi){
        bestInvestor = x;
        bestroi = curValue[x]/origValue[x];
      }
    }
    return bestInvestor;
  },

  // Find out which company was invested the most in using the originalInvestment.
  // Return a companyId
  mostInvestedCompany: function(arr){
    // Fields to be parsed: "originalInvestment", "valueToday"
    var obj = this.totalOriginalInvestmentForCompanies(arr);
    var highest = -Infinity;
    var id;
    Object.keys(obj).forEach(function(key) {
      if (obj[key] > highest){
        highest = obj[key];
        id = key;
      }
    })
    return id;
  }

}
