import React, { useEffect, useState, Component} from "react";
import './App.css';
import { NavLink, Routes, Route} from 'react-router-dom';
import { useParams } from "react-router";
import axios from "axios";
import Pagination from "react-js-pagination";


const App = () => (
  <div className='app'>
    <h1 class="noselect">Internship Qualification Task</h1>
    <p class="noselect">Almanas Alaburda</p>
    <br></br>
    <Navigation />
    <Main />
   </div>
   
);
const Main = () => (
  <Routes>
    <Route path='/' element={<Home />}></Route>
    <Route path='/prideti' element={<Prideti />}></Route>
    <Route path="/details:id" element={<Details />}></Route>
    <Route path="/ieskoti" element={<Ieskoti />}></Route>
  </Routes>
);
const Navigation = () => (
  <nav>
    <ul>
      <li><NavLink exact activeClassName="current" to='/' class="noselect">Pradžia</NavLink></li>
      <li><NavLink exact activeClassName="current" to='/prideti' class="noselect">Pridėti naują įrašą</NavLink></li>
    </ul>
    
  </nav>
);
function Details() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  let { id } = useParams();
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Kraunasi...</div>;
  } else {
    return (
      <div className = "App">
        <p><strong>ID:{id}</strong></p>
          
            {
              //lygybes warning
              // eslint-disable-next-line
            items.filter(items => items.id == id).map(filteredPerson => ( 
              <div>
      <p class='noselect'>User_ID: <strong>{filteredPerson.userId}</strong></p>
    <p class="noselect"><strong>Detalės: </strong>{filteredPerson.body}</p> 
    </div>
 ))}
       </div>
    );
  }
}

function Ieskoti() {

  const [searchValue, setSearch] = React.useState(0);
  const [posts, setPosts] = React.useState([]);
  const [filteredPosts, setFilteredPosts] = React.useState([]);

  const handleSearchChange = (event) => {
    setSearch(parseInt(event.target.value, 10));
  };

  const handleSearchReset = () => {
    setSearch(0);
  };

  React.useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((json) => setPosts(json));
  }, []);

  React.useEffect(() => {
    setFilteredPosts(posts.filter((post) => post.id === searchValue));
  }, [posts, searchValue]);
  
  return (
    <div>
      <h1 class="centrastext">Ieškoti pagal ID</h1>
      <div class="centerieskoti">
      <input
        type="number"
        min={0}
        value={searchValue}
        onChange={handleSearchChange}
      />
      </div>
      <br />
      <div class="container">
      <div class="centerb">
      <button class="button" type="button" onClick={handleSearchReset}>
        Išvalyti
      </button>
      </div></div>
      <table>
            <tr>
            </tr>
            {
              filteredPosts.map((filteredPosts) => ( 
                  <tr>
                  <th>{ filteredPosts.id }</th>
                  <th><a href={'details' + filteredPosts.id}>{ filteredPosts.title }</a></th> 
                  </tr>
                   
              ))
          }
      </table> 
      <br></br>
    </div>
  );
}
class Prideti extends React.Component{

  constructor(){
      super();
      this.state = {
          title:null,
          body:null,
          userId:1,
      }
      
      
      this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
      const target = event.target;
      var value = target.value;
      const name = target.name;
      
      this.setState({
          [name]: value
      });
      
  }
 
  submit(){
      let url = "https://jsonplaceholder.typicode.com/posts";
      let data = this.state;
      function myFunction() {
        alert("title: '" + data.title + "'\nbody: '" + data.body +"'\nuserId: '"+data.userId +"'");
      }
      myFunction();
      fetch(url,{
          method:'POST',
          headers: {
              "Content-type": "application/json; charset=UTF-8"
          },
          body:JSON.stringify(data)
      }).then((result)=>{
          result.json().then((res)=>{
              console.warn('res',res)
            
          })
      })
    
  }

  render(){

      return(
          <div class="center">
              <div class="row">
                  <div class="col-md-6 offset-md-3">
                      <br /><br />
                      <h3 class="centrastext">Prideti įrašą (POST)</h3><br />
                          <div class="centerx">
                              <div class="form-group col-md-6">
                                  <label>Title : </label>
                                  <input type="text" class="form-control" name="title" onChange={this.handleInputChange}/>
                              </div>
                          </div>

                          <div class="centerx">
                              <div class="form-group col-md-12">
                                  <label>Body :</label>
                                  <input type="text" name="body" class="form-control" onChange={this.handleInputChange} />
                              </div>
                          </div>
                          </div>
                          <br></br>
                          <br></br>
                          <div class="container">
                              <div class="centerb">
                                  <button type="submit" class="button" onClick={()=>this.submit()}>Prideti</button>
                                  </div>
                  </div>
              </div>
          </div>
      )  
  }
} 
class Home extends Component {
  
  state = {
    data: [],
    activePage: 1
  };

  componentDidMount() {
    axios
      .get("https://jsonplaceholder.typicode.com/posts?_page=1&_limit=10")
      .then(res => {
        this.setState({
          data: res.data
        });
      });
  }
  handlePageChange = pageNumber => {
    console.log(`active page is ${pageNumber}`);
    axios
      .get(
        `https://jsonplaceholder.typicode.com/posts?_page=${pageNumber}&_limit=10`
      )
      .then(res => {
        this.setState({
          data: res.data
        });
      });
    this.setState({ activePage: pageNumber });
    
  };
  
  render() {
    
    return (
      
      <div className="App">
        <a href='ieskoti' class='ieskoti'>Paieška</a>
        <br></br><br></br>
        <div>
        <table>
          <tr>
            <th>#</th>
            <th>Title</th>
          </tr>
        { 
              this.state.data.map((data) => ( 
                  <tr>
                  <th>{ data.id }.</th>
                  <th><a href={'details' + data.id}>{ data.title }</a></th> 
                  </tr>
               
             
              ))
          }
          </table>
          </div>
        
        <Pagination
          totalItemsCount={200}
          onChange={this.handlePageChange}
          activePage={this.state.activePage}
          itemsCountPerPage={20}
          pageRangeDisplayed={5}
        />
      </div>
    );
  }
}

export default App;