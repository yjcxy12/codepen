var Nav = React.createClass({
  render: function () {
    var tabs = this.props.tabs.map(function (tab) {
      var className = 'tab';
      if (this.props.currentTab === tab) {
        className += ' active';
      }
      return (
        <li className={className} onClick={this.props.handleClick.bind(this, tab)}>{tab[0].toUpperCase() + tab.substring(1)}</li>
      );
    }, this);
    return (
      <ul className="nav">
        {tabs}
      </ul>
    );
  }
});

var Chanel = React.createClass({
  handleClick: function (username) {
    window.open('http://www.twitch.tv/' + username);
  },
  render: function () {
    var chanels = this.props.chanels.map(function (username) {
      if (!this.props.info[username]) return;
      var status = this.props.info[username].stream && this.props.info[username].stream.stream ?
          <span className="fa fa-video-camera" style={{color: 'green'}}></span> :
          <span className="fa fa-user-times" style={{color: 'red'}}></span>;
      var discription = this.props.info[username].stream && this.props.info[username].stream.stream ?
          this.props.info[username].stream.stream.channel.status : ' ';
               
      return (
        <li className="chanels-item" onClick={this.handleClick.bind(this, username)}>
          <div className="chanels-item-usericon">
            <img src={this.props.info[username].user.logo} height="32" width="32"></img>
          </div>
          <div className="chanels-item-discription">
            <div className="chanels-item-discription-username">
              {this.props.info[username].user.name}
            </div>
            <div className="chanels-item-discription-title">
              {discription}
            </div>
          </div>
          <div className="chanels-item-status">
            {status}
          </div>
        </li>
      );
    }, this);
    return (
      <div className="chanels">
        <ul>
          {chanels}
        </ul>
      </div>
    );
  }
});

var Search = React.createClass({
  
  render: function () {
    return (
      <div className="search-bar">
        <div className="search-bar-whole">
          <span className="search-bar-icon fa fa-search"></span>
          <input type="text" className="search-bar-input" onChange={this.props.handleChange} value={this.props.search}/>
        </div>
      </div>
    );
  }
});

var Top = React.createClass({
  getInitialState: function () {
    return {
      tab: 'all',
      chanels: [],
      info: {},
      search: ''
    };
  },
  
  componentDidMount: function() {
    var promises = this.getStreams();
    promises = promises.concat(this.getUsers());
    this.resolve(promises);
    this.handleClick('all');
  },
  
  //tab click handler
  handleClick: function (tab) {
    this.filterChannel(tab, this.state.search);
  },
  
  //Search input change handler
  handleChange: function (event) {
    this.filterChannel(this.state.tab, event.target.value);
  },
  
  filterChannel: function (tab, search) {
    var chanels = [];
    var regex = new RegExp(search, 'i');
    switch (tab) {
      case 'online':
        chanels = this.props.chanels.filter(function (chanel) {
          return this.props.info[chanel].stream.stream;
        }, this);
        break;
      case 'offline':
        chanels = this.props.chanels.filter(function (chanel) {
          return !this.props.info[chanel].stream.stream;
        }, this);
        break;
      default:
        chanels = this.props.chanels;
        break;
    }
    chanels = chanels.filter(function (channel) {
      return regex.test(channel);
    });
    this.setState({
      tab: tab,
      chanels: chanels,
      info: this.props.info,
      search: search
    });
  },
  
  resolve: function (promises) {
    $.when.apply($, promises).done((function () {
      this.setState({
        tab: this.state.tab,
        info: this.props.info
      });
    }).bind(this));
  },
  
  getStreams: function () {
    var promises = this.props.chanels.map(function (username) {
      var defer = $.Deferred();
      var url = this.props.url + 'streams/' + username + this.props.param;
      $.getJSON(url, function(result) {
        if (this.props.info[username] === undefined) {
          this.props.info[username] = {};
        }
        this.props.info[username].stream = result;
        defer.resolve();
      }.bind(this));
      return defer;
    }, this);
    return promises;
  },
  
  getUsers: function () {
    var promises = this.props.chanels.map(function (username) {
      var defer = $.Deferred();
      var url = this.props.url + 'users/' + username + this.props.param;
      $.getJSON(url, function(result) {
        if (this.props.info[username] === undefined) {
          this.props.info[username] = {};
        }
        this.props.info[username].user = result;
        defer.resolve();
      }.bind(this));
      return defer;
    }, this);
    return promises;
  },
  
  render: function () {
    return (
      <div className="main-display">
        <Nav handleClick={this.handleClick.bind(this)} tabs={this.props.tabs} currentTab={this.state.tab}/>
        <Search handleChange={this.handleChange.bind(this)} search={this.state.search} />
        <Chanel chanels={this.state.chanels} info={this.state.info}/>
      </div>
    );
  }
});

var url = 'https://api.twitch.tv/kraken/';
var param = '?callback=?';
var chanels = ["freecodecamp","storbeck","terakilobyte","habathcx","RobotCaleb","comster404","brunofin","thomasballinger","noobs2ninjas","beohoff", 'medrybw'];
var tabs = ['all', 'online', 'offline'];
    
React.render(
  <Top url={url} param={param} tabs={tabs} chanels={chanels} info={{}}/>,
  document.body
);