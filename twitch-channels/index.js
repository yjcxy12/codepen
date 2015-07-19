var Nav = React.createClass({displayName: "Nav",
  render: function () {
    var tabs = this.props.tabs.map(function (tab) {
      var className = 'tab';
      if (this.props.currentTab === tab) {
        className += ' active';
      }
      return (
        React.createElement("li", {className: className, onClick: this.props.handleClick.bind(this, tab)}, tab[0].toUpperCase() + tab.substring(1))
      );
    }, this);
    return (
      React.createElement("ul", {className: "nav"}, 
        tabs
      )
    );
  }
});

var Chanel = React.createClass({displayName: "Chanel",
  handleClick: function (username) {
    window.open('http://www.twitch.tv/' + username);
  },
  render: function () {
    var chanels = this.props.chanels.map(function (username) {
      if (!this.props.info[username]) return;
      var status = this.props.info[username].stream && this.props.info[username].stream.stream ?
          React.createElement("span", {className: "fa fa-video-camera", style: {color: 'green'}}) :
          React.createElement("span", {className: "fa fa-user-times", style: {color: 'red'}});
      var discription = this.props.info[username].stream && this.props.info[username].stream.stream ?
          this.props.info[username].stream.stream.channel.status : ' ';
               
      return (
        React.createElement("li", {className: "chanels-item", onClick: this.handleClick.bind(this, username)}, 
          React.createElement("div", {className: "chanels-item-usericon"}, 
            React.createElement("img", {src: this.props.info[username].user.logo, height: "32", width: "32"})
          ), 
          React.createElement("div", {className: "chanels-item-discription"}, 
            React.createElement("div", {className: "chanels-item-discription-username"}, 
              this.props.info[username].user.name
            ), 
            React.createElement("div", {className: "chanels-item-discription-title"}, 
              discription
            )
          ), 
          React.createElement("div", {className: "chanels-item-status"}, 
            status
          )
        )
      );
    }, this);
    return (
      React.createElement("div", {className: "chanels"}, 
        React.createElement("ul", null, 
          chanels
        )
      )
    );
  }
});

var Search = React.createClass({displayName: "Search",
  
  render: function () {
    return (
      React.createElement("div", {className: "search-bar"}, 
        React.createElement("div", {className: "search-bar-whole"}, 
          React.createElement("span", {className: "search-bar-icon fa fa-search"}), 
          React.createElement("input", {type: "text", className: "search-bar-input", onChange: this.props.handleChange, value: this.props.search})
        )
      )
    );
  }
});

var Top = React.createClass({displayName: "Top",
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
      React.createElement("div", {className: "main-display"}, 
        React.createElement(Nav, {handleClick: this.handleClick.bind(this), tabs: this.props.tabs, currentTab: this.state.tab}), 
        React.createElement(Search, {handleChange: this.handleChange.bind(this), search: this.state.search}), 
        React.createElement(Chanel, {chanels: this.state.chanels, info: this.state.info})
      )
    );
  }
});

var url = 'https://api.twitch.tv/kraken/';
var param = '?callback=?';
var chanels = ["freecodecamp","storbeck","terakilobyte","habathcx","RobotCaleb","comster404","brunofin","thomasballinger","noobs2ninjas","beohoff", 'medrybw'];
var tabs = ['all', 'online', 'offline'];
    
React.render(
  React.createElement(Top, {url: url, param: param, tabs: tabs, chanels: chanels, info: {}}),
  document.body
);