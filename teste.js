const onCountryChange = async (event) => {
  

   await fetch('https://disease.sh/v3/covid-19/all' )
      .then((response) => {
         response.json();
         console.log('resposeJSON ' + response.json());
      })
      .then((data) => {
         console.log(data);
       
      });
   
   // console.log(countryInfo);
};


console.log(onCountryChange());