
let map=document.getElementById("map");
let ipTag = document.querySelector("h1");
let ipAddr = "";
let token="989d126bc46a23";
let ipData="";
let lat="";
let lon="";
let postalData=""

var postalElement=document.querySelector(".postOffice-data");

async function getIp() {
  ipAddr = await fetch("https://api.ipify.org?format=json")
    .then(response => response.json())
    .then(data =>data.ip);
}

getIp()
  .then(() => {
    ipTag.innerText += ipAddr;
})

async function getData(){
    ipData=await fetch(`https://ipinfo.io/${ipAddr}?token=${token}`).then((response)=>response.json()).then((data)=>ipData=data);
    lat=ipData.loc.split(",")[0];
    lon=ipData.loc.split(",")[1];
    console.log(lat,lon);
}

function getCurrentTime(timeZone){
    var now = new Date();

  // Create options object with specified time zone
  var options = {
    timeZone: timeZone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };

  // Format the date and time according to the options
  const formatter = new Intl.DateTimeFormat([], options);
  var dateAndTime = formatter.format(now);

  // Return the formatted date and time
  return dateAndTime;
}

async function getPostalData(pin){
 return  await fetch(`https://api.postalpincode.in/pincode/${pin}`).then((response)=>response.json());
}

document.getElementById("getData").addEventListener("click", (e) => {
  var button = e.target;
  button.style.display = "none";
  document.querySelector(".second").style.display="block"
  getData().then(()=>{console.log(ipData);
    document.getElementById("lat").innerHTML+=lat;
    document.getElementById("long").innerHTML+=lon;
    document.getElementById("city").innerHTML+=ipData.city;
    document.getElementById("org").innerHTML+=ipData.org;
    document.getElementById("region").innerHTML+=ipData.region;
    document.getElementById("host").innerHTML+=ipData.hostname;
    document.getElementById("time").innerHTML+=ipData.timezone;
    document.getElementById("pin").innerHTML+=ipData.postal;
    document.getElementById("date").innerHTML+=getCurrentTime(ipData.timezone);

    getPostalData(ipData.postal).then((data)=>{
        postalData=data[0];
        document.getElementById("message").innerHTML+=postalData.Message;
        console.log(postalData);
        renderItems(postalData.PostOffice)
    })

    map.src=`https://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed`;


});
  
});

function renderItems(data){
    var innerHtml="";
    postalElement.innerHTML=""
    data.forEach((i)=>{
       innerHtml+=`<div class="item">
        <p><strong>Name :</strong> ${i.Name}</p>
        <p><strong>Branch Type :</strong> ${i.BranchType}</p>
        <p><strong>Delivery Status :</strong> ${i.DeliveryStatus}</p>
        <p><strong>District :</strong> ${i.District}</p>
        <p><strong>Division :</strong> ${i.Division}</p>
    </div>`
    })

    postalElement.innerHTML+=innerHtml
}
// filtering function
const searchInput = document.getElementById("search");
searchInput.addEventListener("input", () => {
  const searchString = searchInput.value.trim().toLowerCase();
  const filteredData = data.filter(
    (i) =>
      i.Name.toLowerCase().includes(searchString) ||
      i.BranchType.toLowerCase().includes(searchString)
  );
  renderItems(filteredData);
});
// })