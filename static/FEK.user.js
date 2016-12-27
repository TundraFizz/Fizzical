// ==UserScript==
// @name        F.E.K.
// @author      Tundra Fizz
// @version     4.6.0
// @namespace   http://videomatic3.diskstation.me/~tundrafizz/
// @include     http://*.leagueoflegends.com/*
// @run-at      document-end
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require     http://35.161.242.105/fek/libs/perfect-scrollbar.js
// @grant       GM_log
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// ==/UserScript==
// Copyright April 2016 - All Rights Reserved
// You are free to modify this file as you like, but don't redistribute without my permission.
// Written by Leif Coleman (Tundra Fizz - NA) <mageleif@yahoo.com>
// http://boards.na.leagueoflegends.com/en/c/miscellaneous/3V6I7JvK

// Prevent FEK from running more than once per page load
if(window.top != window.self) return;

/* jshint multistr: true */
//Date.prototype.StandardTimezoneOffset = function() {var jan = new Date(this.getFullYear(), 0, 1); var jul = new Date(this.getFullYear(), 6, 1); return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());}
Date.prototype.StandardTimezoneOffset = function() {var jan = new Date(this.getFullYear(), 0, 1); var jul = new Date(this.getFullYear(), 6, 1); return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());};
Date.prototype.dst = function() {return this.getTimezoneOffset() < this.StandardTimezoneOffset();};

var FEKversion       = "4.6.0";
var FEKpage          = "http://boards.na.leagueoflegends.com/en/c/miscellaneous/3V6I7JvK";
var FEKendpoint      = "http://35.161.242.105/fek/Database.php";
var FEKavatars       = "http://35.161.242.105/avatars/";
var FEKgfx           = "http://tundrafizz.com/fek/gfx/misc/";
var cIcons           = "http://tundrafizz.com/fek/gfx/iconsmallchampion/";
var FEKgfxLargeChamp = "http://tundrafizz.com/fek/gfx/iconlargechampion/";
var FEKgfxLargeSpell = "http://tundrafizz.com/fek/gfx/iconlargespell/";
var FEKgfxLargeItem  = "http://tundrafizz.com/fek/gfx/iconlargeitem/";
var FEKtweets        = [];
var activeKeys       = [];
var overheadTimers   = [];
var hotkeys          = [];
var users            = [];
var regions          = [];
var results          = [];
var errorMessage     = "";

LoadCSS("http://35.161.242.105/fek/css/fekv4panel.css");
LoadCSS("http://35.161.242.105/fek/css/fekevent.css");

//////////////////////////////////////////////////////
// Modify the navigation bar at the top of the page //
//////////////////////////////////////////////////////

var RiotBar;

document.body.style.setProperty("min-width", "1050px");          // Resizes the minimum width for the page
// RiotBar = document.getElementsByClassName("riotbar-nav")[0];     // Gets the RiotBar at the top of the webpage
RiotBar = $("#riotbar-bar");

if(RiotBar)
{
  // alert("1");
  // RiotBar.attr("overflow", "visible");               // ????????????????
  // RiotBar.style.setProperty("overflow", "visible");                // Makes it so that NavBar dropdown menus will be shown instead of hidden

  // RiotBar.children[3].style.setProperty("width", "81px");          // Forces the Boards links at the top to always be the same width
  // alert("3");

  // document.getElementById("riotbar-bar").style.setProperty("z-index", "5000", "important");
  $(RiotBar).attr("z-index", "-5000 !important");
  // alert("2");

  // var sldk = document.getElementById("riotbar-bar");
  // if(sldk) alert("YES!");
  // else alert("no........");
}
else
{
  // RIOTBAR WAS NOT FOUND!
  //ReportError("RiotBar was not found");
}

/////////////////////////////////
// Get Board's Platform Region //
/////////////////////////////////
var windowURL      = window.location.href;
var start          = windowURL.indexOf(".") + 1;
var end            = windowURL.indexOf(".", start);
var platformRegion = windowURL.substring(start, end);

//////////////////////////
// Variables: Page Data //
//////////////////////////
var page;             if     (document.getElementById("discussions"))                                                       page  = "Index";  // Board Index
                      else if(document.getElementById("comments"))                                                          page  = "Thread"; // Inside a thread
                      else                                                                                                  page  = "NULL";   // Not on the index or in a thread
var title;            if     (typeof (document.getElementsByTagName("h2")[0].getElementsByTagName("a")[0]) === "undefined") title = document.getElementsByTagName("h2")[0].innerHTML;                              // Gets the title of the page
                      else                                                                                                  title = document.getElementsByTagName("h2")[0].getElementsByTagName("a")[0].innerHTML; // Gets the title of the page
                      if     (title == "My Updates")                                                                        page  = "My Updates";   // My Updates is special and must match the title
var threadMode;       if     (page == "Thread" && document.getElementsByClassName("flat-comments").length)                  threadMode = "Chrono";  // Chronological Mode
                      else if(page == "Thread" && !document.getElementsByClassName("flat-comments").length)                 threadMode = "Discuss"; // Discussion Mode
                      else                                                                                                  threadMode = "NULL";    // We're not in a thread

if(page == "Thread")
{
  var head  = document.getElementsByTagName("head")[0];
  var link  = document.createElement("link");
  link.id   = "fek-thread-css";
  link.rel  = "stylesheet";
  link.type = "text/css";
  link.href = "http://35.161.242.105/fek/css/thread.css";
  link.media = "all";
  head.appendChild(link);
}

////////////////////////////
// Variables: FEK Options //
////////////////////////////
var hide                      = {};
var avatarSize                = "off";
var fallbackAvatar            = "off";
var votingDisplay             = "off";
var blacklisting              = "off";
var OPStyle                   = "off";
var removeProfHovPop          = "off";
var enhancedThreadPreview     = "off";
var highlightMyThreads        = "off";
var boardsDropdownMenu        = "off";
var animateThumbnails         = "off";
var emptyVoteReplacement      = "off";
var embedMedia                = "off";
var favoriteChampion          = "off";
var favoriteSpell             = "off";
var favoriteItem              = "off";
var favoriteIcons             = "off";
var rollDice                  = "off";
var invisible                 = "false";
var recordOverhead            = GM_getValue("_recordOverhead", "off");

hide["Gameplay"]                     = "off";
hide["Story, Art, & Sound"]          = "off";
hide["Esports"]                      = "off";
hide["Team Recruitment"]             = "off";
hide["Concepts & Creations"]         = "off";
hide["Player Behavior & Moderation"] = "off";
hide["Miscellaneous"]                = "off";
hide["Memes & Games"]                = "off";
hide["General Discussion"]           = "off";
hide["Roleplay"]                     = "off";
hide["Help & Support"]               = "off";
hide["Report a Bug"]                 = "off";
hide["Boards Feedback"]              = "off";

/////////////////////
// Variables: Misc //
/////////////////////
var originalPoster    = "";                    // The name of the original poster in a thread
var currentDate       = new Date();            // Gets today's date
var RPint             = GM_getValue("_RP", 0); // Keeps track of which pinned threads the user has visited in the Roleplaying board
var alertPopUp        = false;                 // Only one alert can display at a time
                                               // 1: Can't connect to FEK server
                                               // 2: FEK needs to be updated
                                               // 3: API Error
                                               // 4: Account Management
                                               // 5: Roleplaying Alert
//////////////////////////
// Variables: User Data //
//////////////////////////
var myName;
var myRegion;

//if(typeof document.getElementsByClassName("summoner-name-value")[0] != "undefined")
if($(".riotbar-summoner-info").length)
{
  myName   = $(".riotbar-summoner-name").first().text()
  myRegion = $(".riotbar-summoner-region").first().text()

  if     (myRegion == "North America")    myRegion = "NA";
  else if(myRegion == "Oceania")          myRegion = "OCE";
  else if(myRegion == "EU West")          myRegion = "EUW";
  else if(myRegion == "EU Nordic & East") myRegion = "EUNE";
}

///////////////////////////////
// LoadCSS: Loads a CSS file //
///////////////////////////////
function LoadCSS(url)
{
  var head     = document.getElementsByTagName("head")[0];
  var cssFile  = document.createElement("link");
  cssFile.type = "text/css";
  cssFile.rel  = "stylesheet";
  cssFile.href = encodeURI(url);
  head.appendChild(cssFile);
}

function ReportError(msg)
{
  if(errorMessage != "")
    errorMessage += "<br><br>";

  errorMessage += msg;

  // If an errorIcon doesn't currently exist
  if(document.getElementById("errorFek") == null)
  {
    var errorFek = document.createElement("div");
    errorFek.setAttribute("id", "errorFek");
    $("#riotbar-service-status").append(errorFek);

    var errorFekIcon = document.createElement("img");
    errorFekIcon.setAttribute("id", "errorFekIcon");
    errorFekIcon.setAttribute("src", "http://i.imgur.com/djAvEc6.png");
    errorFekIcon.style.setProperty("position", "relative");
    errorFekIcon.style.setProperty("top", "5px");

    $(errorFek).append(errorFekIcon);

    $(errorFekIcon).hover(function() {errorFekIcon.setAttribute("src", "http://i.imgur.com/Y32t3E5.png");}, function() {errorFekIcon.setAttribute("src", "http://i.imgur.com/djAvEc6.png");});

    $(errorFekIcon).on("click", function(event)
    {
      event.stopPropagation();
      event.preventDefault();

      if(document.getElementById("errorFekInfo") == null)
      {
        var errorFekInfo = document.createElement("div");
        errorFekInfo.setAttribute("id", "errorFekInfo");
        errorFekInfo.style.setProperty("position", "absolute");
        errorFekInfo.style.setProperty("top", "48px");
        errorFekInfo.style.setProperty("right", "-80px");
        errorFekInfo.style.setProperty("width", "350px");
      //errorFekInfo.style.setProperty("padding", "14px 20px 10px 40px");
        errorFekInfo.style.setProperty("padding", "10px 20px 10px 20px");
        errorFekInfo.style.setProperty("border-radius", "5px");
        errorFekInfo.style.setProperty("border-width", "1px");
        errorFekInfo.style.setProperty("border-style", "solid");
        errorFekInfo.style.setProperty("border-color", "#7E744E #B6A671 #55513A");
        errorFekInfo.style.setProperty("box-shadow", "0px 0px 3px 1px rgba(0, 0, 0, 0.3) inset, -1px 1px 10px 0px rgba(0, 0, 0, 0.8)");
        errorFekInfo.style.setProperty("background", "transparent linear-gradient(#1F3948, #0D1417) repeat scroll 0% 0%");
        errorFekInfo.style.setProperty("-webkit-touch-callout", "text");
        errorFekInfo.style.setProperty("-webkit-user-select", "text");
        errorFekInfo.style.setProperty("-khtml-user-select", "text");
        errorFekInfo.style.setProperty("-moz-user-select", "text");
        errorFekInfo.style.setProperty("-ms-user-select", "text");
        errorFekInfo.style.setProperty("-ms-user-select", "text");

        errorFekInfo.style.setProperty("font-family", "Tahoma");
        errorFekInfo.style.setProperty("color", "#9B9480");
        errorFekInfo.style.setProperty("font-size", "12px");
        errorFekInfo.style.setProperty("line-height", "1.4em");
        errorFekInfo.style.setProperty("z-index", "10");

        errorFekInfo.innerHTML = errorMessage;
        $(errorFek).append(errorFekInfo);

        var errorFekArrowContainer = document.createElement("div");
        errorFekArrowContainer.setAttribute("id", "errorFekArrowContainer");
        errorFekArrowContainer.style.setProperty("height", "15px");
        errorFekArrowContainer.style.setProperty("overflow", "hidden");
        $(errorFek).append(errorFekArrowContainer);

        var errorFekArrow = document.createElement("div");
        errorFekArrow.setAttribute("id", "errorFekArrow");
        errorFekArrow.style.setProperty("position", "relative");
        errorFekArrow.style.setProperty("content", "");
        errorFekArrow.style.setProperty("top", "10px");
        errorFekArrow.style.setProperty("right", "-10px");
        errorFekArrow.style.setProperty("width", "10px");
        errorFekArrow.style.setProperty("height", "10px");
        errorFekArrow.style.setProperty("background", "repeating-linear-gradient(135deg, #044247 0px, #232930 6.5px)");
        errorFekArrow.style.setProperty("border-top", "1px solid #7E744E");
        errorFekArrow.style.setProperty("border-left", "1px solid #7E744E");
        errorFekArrow.style.setProperty("-webkit-transform", "rotate(45deg)");
        errorFekArrow.style.setProperty("-moz-transform", "rotate(45deg)");
        errorFekArrow.style.setProperty("-ms-transform", "rotate(45deg)");
        errorFekArrow.style.setProperty("transform", "rotate(45deg)");
        errorFekArrow.style.setProperty("z-index", "10");
        $(errorFekArrowContainer).append(errorFekArrow);

        // Allow clicking away from the panel to close the message box
        $("body").click(function()
        {
          document.getElementById("errorFekArrow").remove();
          document.getElementById("errorFekArrowContainer").remove();
          document.getElementById("errorFekInfo").remove();
        });
      }
      else
      {
        document.getElementById("errorFekArrow").remove();
        document.getElementById("errorFekArrowContainer").remove();
        document.getElementById("errorFekInfo").remove();
      }
    });
  }
}

///////////////////////////////////////
// ========== ENTRY POINT ========== //
///////////////////////////////////////
(function()
{
  CreateGUI();
  CreateFeatures();
  SettleGUI();
  document.getElementById("fekpanel").style.setProperty("visibility", "hidden", "important");
  KeyWatch();

  if(document.title == "Boards")
  {
    HideSubboards();
  }

  try
  {
    AddFEKNavBar();
  }
  catch(err)
  {
    ReportError("Error Code: 2");
  }

  try
  {
    // if(boardsDropdownMenu == "on")
    //   AddBoardsNavBar();
  }
  catch(err)
  {
    ReportError("Error Code: 3");
  }

  try
  {
    if((page == "Thread" || page == "Index") && platformRegion == "na")
    {
      var markdownNav = document.getElementById("markdown-nav");
      var timeOut     = 2000, currentTime = 0;

      var interval = setInterval(function()
      {
        currentTime = currentTime + 1;

        if(currentTime >= timeOut)
        {
          clearInterval(interval);
        }
        else
        {
          if(markdownNav.children.length)
          {
            clearInterval(interval);
            RemoveNavListLinks();
          }
        }
      }, 1);
    }
  }
  catch(err)
  {
    ReportError("Error Code: 4");
  }

  if(page == "Index")
  {
    if(emptyVoteReplacement != "off")
      EmptyVoteReplacement(); // For boards without voting

    if($(".no-voting").length)
      WaitAndRun(".no-voting", LoadIndex);
    else
    {
      WaitAndRun(".total-votes", LoadIndex);
    }
  }
  else if(page == "Thread")
  {
    WaitAndRun(".profile-hover", LoadThread);
  }

  if(page == "Thread" && favoriteIcons != "off")
    WaitAndRun(".button.gamedata.champion", FavoriteIcons);

  document.getElementById("fekpanel").style.setProperty("visibility", "visible", "important");

  if(RPint < 15 && title == "Roleplaying" && alertPopUp === false) RoleplayingAlert();
})();

//////////////////////////////////////////////////////////////////////////////
// EmptyVoteReplacement: Fills things in the gutter on boards with no votes //
//////////////////////////////////////////////////////////////////////////////
function EmptyVoteReplacement()
{
  if(emptyVoteReplacement == "banners")
  {
    $(".inline-profile").each(function()
    {
      var src           = "http://i.imgur.com/NcHbI1d.png";
      var votingElement = $(this).parent().parent().parent().find(".no-voting");
      $(votingElement).html('<div class="riot-apollo voting"><ul class="riot-voting">\
                         <li class="total-votes"><img style="width: auto; max-width: 30px; max-height: 30px;" src="' + src + '"></li>\
                         </ul></div>');
    });
  }
  else if(emptyVoteReplacement == "bannersavatars")
  {
    users   = [];
    regions = [];

    $(".inline-profile").each(function()
    {
      var username = this.getElementsByClassName("username")[0].textContent;
      var region   = this.getElementsByClassName("realm")[0].textContent;
          region   = region.substring(1, region.length - 1);

      users.push(username);
      regions.push(region);
    });

    $.ajax(
    {
      dataType: "json",
      url: FEKendpoint,
      data:
      {
        action:  "GetOnlyAvatars",
        users:   users,
        regions: regions
      }
    }).success(function(data)
    {
      $(".inline-profile").each(function()
      {
        var username = this.getElementsByClassName("username")[0].textContent;
        var region   = this.getElementsByClassName("realm")[0].textContent;
            region   = region.substring(1, region.length - 1);
        var votingElement = $(this).parent().parent().parent().find(".no-voting");
        var avatar = data["records"][username][region].avatar;
        var src;

        if(avatar !== undefined) src = avatar;
        else                     src = "http://i.imgur.com/NcHbI1d.png";

        $(votingElement).html('<div class="riot-apollo voting"><ul class="riot-voting">\
                         <li class="total-votes"><img style="width: auto; max-width: 30px; max-height: 30px;" src="' + src + '"></li>\
                         </ul></div>');
      });
    });
  }
}

///////////////////////////////////////////////////////////////////////////
// HideSubboards: Hides the sub-boards that the user doesn't want to see //
///////////////////////////////////////////////////////////////////////////
function HideSubboards()
{
  $(".discussion-list-item").each(function()
  {

    // Always show pinned threads
    if(!$(this.getElementsByClassName("pin")[0]).length)
    {
      var subboard = this.getElementsByClassName("discussion-footer")[0].getElementsByTagName("a")[1];

      // Only hide the thread if it's from a board that is recognized
      if(typeof subboard !== "undefined")
      {
        var subboard = this.getElementsByClassName("discussion-footer")[0].getElementsByTagName("a")[1].textContent;
        if(hide[subboard] == "on")
        {
          $(this).remove();
        }
      }
    }
  });
}

//////////////////////////////////////////////////////////////////////////////
// FavoriteIcons: Changes the champion/spell/item icons in the posting area //
//////////////////////////////////////////////////////////////////////////////
function FavoriteIcons()
{
  $(".button.gamedata.champion").each(function()
  {
    this.style.setProperty("background-image", "url('" + FEKgfxLargeChamp + favoriteChampion + ".png')", "important");
    this.style.setProperty("background-position", "-3px -3px", "important");
    this.style.setProperty("background-size", "120% auto", "important");

    if(favoriteIcons == "mouseover")
      SetGrayscaleProperties(this);
  });

  $(".button.gamedata.summoner").each(function()
  {
    this.style.setProperty("background-image", "url('" + FEKgfxLargeSpell + favoriteSpell + ".png')", "important");
    this.style.setProperty("background-position", "-3px -3px", "important");
    this.style.setProperty("background-size", "120% auto", "important");

    if(favoriteIcons == "mouseover")
      SetGrayscaleProperties(this);
  });

  $(".button.gamedata.item").each(function()
  {
    this.style.setProperty("background-image", "url('" + FEKgfxLargeItem + favoriteItem + ".png')", "important");
    this.style.setProperty("background-position", "-3px -3px", "important");
    this.style.setProperty("background-size", "120% auto", "important");

    if(favoriteIcons == "mouseover")
      SetGrayscaleProperties(this);
  });
}

///////////////////////////////////////////////////////
// SetGrayscaleProperties: Sets grayscale properties //
///////////////////////////////////////////////////////
function SetGrayscaleProperties(obj)
{
  obj.style.setProperty("filter", "grayscale(1)", "important");

  $(obj).hover(function()
  {
    obj.style.setProperty("filter", "grayscale(0)", "important");
  }, function()
  {
    obj.style.setProperty("filter", "grayscale(1)", "important");
  });
}

//////////////////////////////////////
// ========== LOAD PAGES ========== //
//////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
// QueryFEKServer: Makes a connection to the FEK server for information //
//////////////////////////////////////////////////////////////////////////
function QueryFEKServer()
{
  $.ajax(
  {
    dataType: "json",
    url: FEKendpoint,
    data:
    {
      action:     "GetMemberData",
      myName:     myName,
      myRegion:   myRegion,
      invisible:  invisible,
      users:      users,
      regions:    regions
    }
  }).success(function(data)
  {
    results   = data.records;
    FEKtweets = data.tweets;
    FEKevent  = data.event;
    var unixTime = Math.floor(Date.now() / 1000);

    // THIS FEATURE TEMPORARILY DISABLED!
    // if((unixTime > FEKevent.start) && (unixTime < FEKevent.end))
    if(0)
    {
      var NavBarEvent = document.createElement("li");
      AddToNavBar(NavBarEvent, "touchpoint-event", "<a href='#'>Event</a>\
      <div id='fek-event'>\
        <div id='fek-event-top'>" + FEKevent.message + "</div>\
        <div id='fek-event-bottom-left'>\
          <a href='" + FEKevent.stream + "' target='_blank' style='padding: 2px;'>Twitch Stream</a>\
        </div>\
        <div id='fek-event-bottom-right'>\
          <a href='" + FEKevent.thread + "' target='_blank' style='padding: 2px;'>Boards Thread</a>\
        </div>\
      </div>", RiotBar, 8);

      window.setInterval(function(){$(".touchpoint-event").toggleClass("pulse");}, 1000);

      // Hides dropdown event information by default, and displays it with mouse hover
      $("#fek-event").hide();
      $(".touchpoint-event").hover(function() {$("#fek-event").show();}, function(){$("#fek-event").hide();});
    }

    if(FEKversion != results.version && window.location.href != FEKpage)
    {
      CreateAlertBox("14px", "#990000", "#DD0000", "#FFFFFF",
                     "There has been an update to FEK!<br /><br />\
                     <a href='" + results.details + "'style='color:#00C0FF;'>Click here</a> for the post detailing new changes and to download version " + results.version);
    }
    else
    {
      if(typeof results.apiStatusCode !== "undefined" && alertPopUp === false)
      {
        CreateAlertBox("14px", "#990000", "#DD0000", "#FFFFFF",
                       "Error " + results.apiStatusCode + ": " + results.apiMessage);
      }

      if(typeof results.alert !== "undefined" && alertPopUp === false)
      {
        CreateAlertBox(results.top, results.color1, results.color2, results.font,
                       results.alert);
      }
    }

    if(page == "Thread")
    {
      FormatAllPosts(true);
    }

//$(".up-vote").click(function(event)
//{
//  alert("sdfdsf");
//});

  }).error(function()
  {
    CreateAlertBox("14px", "#990000", "#DD0000", "#FFFFFF",
                   "Unable to connect to the FEK server, <a href='https://twitter.com/Tundra_Fizz' target='_blank'>try checking Twitter</a> for possible status updates.");
  }).always(function()
  {
    $.event.trigger({type: "tweetsLoaded"});
  });
}

////////////////////////////////////////////////////
// LoadIndex: Loads everything for the Index page //
////////////////////////////////////////////////////
function LoadIndex()
{
  if(blacklisting)
    IndexBlacklist();

  RemoveThumbnailBackground();
  ColorVotes();
  HoverVotes();

  if(enhancedThreadPreview == "on")
    EnhancedThreadPreview();

  if(highlightMyThreads != "off")
    HighlightMyThreads();

  QueryFEKServer();
}

/////////////////////////////////////////////////////////////////////
// IndexBlacklist: Hides threads by blacklisted users on the index //
/////////////////////////////////////////////////////////////////////
function IndexBlacklist()
{
  $(".discussion-list-item.row").each(function()
  {
    // Skip threads that have no username (such as Announcements)
    if($(this).find(".username")[0])
    {
      var usernameT = this.getElementsByClassName("username")[0].textContent;
      var regionT   = this.getElementsByClassName("realm")[0].textContent;

      // If it's a person you blacklisted, hide the thread
      if(GM_getValue(usernameT + " " + regionT, 0) == 1)
      {
        $(this).remove();
      }
    }
  });
}

//////////////////////////////////////////////////////
// LoadThread: Loads everything for the Thread page //
//////////////////////////////////////////////////////
function LoadThread()
{
  // Remove all "Posting as X" fields
  $(document).find('.bottom-bar.clearfix.box').find('.left').remove();

  // Make sure that the users/regions arrays are empty, since they will have
  // left-over data from when people switch pages in chronological view
  users   = [];
  regions = [];

  // Get information on every person within the thread
  $(".inline-profile").each(function()
  {
    var username = this.getElementsByClassName("username")[0].textContent;
    var region   = this.getElementsByClassName("realm")[0].textContent;
        region   = region.substring(1, region.length - 1);

    // FEK staff have special gradient names, so I need to extract them using this method
    if(this.getElementsByClassName("pxg-set").length > 0)
    {
      username = this.getElementsByClassName("pxg-set")[0].childNodes[0].textContent;
    }

    users.push(username);
    regions.push(region);
  });

  // Bring .toggle-minimized to the front so people can click on it
  $(".toggle-minimized").each(function(){$(this).css("z-index", "1");});

  WaitAndRun(".profile-hover", FormatAllPosts);

  ColorVotes();
  HoverVotes();
  QueryFEKServer();

  if(embedMedia == "on")
    EmbedMedia();
}

////////////////////////////////////////////////////////////////
// FormatSomePosts: Calls FormatSinglePost on only some posts //
////////////////////////////////////////////////////////////////
function FormatSomePosts(FEKData = false)
{
  if(!FEKData)
  {
    $(".body-container").each(function()
    {
      FormatSinglePost1(this, false);
    });
  }
  else
  {
    $(".body-container").each(function()
    {
      // Only execute the function if the post is not deleted
      if(!$($(this).find(".deleted")[0]).is(":visible"))
        FormatSinglePost2(this, false);
    });
  }
}

//////////////////////////////////////////////////////////////////////
// FormatAllPosts: Calls FormatSinglePost on every post that exists //
//////////////////////////////////////////////////////////////////////
function FormatAllPosts(FEKData = false)
{
  $(document).find(".toggle-minimized").remove();

  if(!FEKData)
  {
    if(document.getElementsByClassName("op-container")[0].getElementsByClassName("inline-profile").length)
    {
      $(".op-container").each(function()
      {
        FormatSinglePost1(this, true);
      });
    }

    $(".body-container").each(function()
    {
      FormatSinglePost1(this, false);
    });
  }
  else
  {
    if(document.getElementsByClassName("op-container")[0].getElementsByClassName("inline-profile").length)
    {
      $(".op-container").each(function()
      {
        FormatSinglePost2(this, true);
      });
    }

    $(".body-container").each(function()
    {
      // Only execute the function if the post is not deleted
      if(!$($(this).find(".deleted")[0]).is(":visible"))
        FormatSinglePost2(this, false);
    });
  }

  // isMinimized
  $(".toggle-minimized").click(function()
  {
    // Put everything in a container and then hide it

    var post = $(this).parent()[0];

    if($(this).parent().hasClass("isMinimized"))
    {
      // Minimizing the post

      if($(post).find(".hide-post").length == 0)
      {
        // If the container doesn't exist, make it
        // Classes:
        // 0. masthead
        // 1. toggle-minimized
        // 2. newline
        // 3. small
        // 4. body-container
        // 5. list
        // 6. paging
        //
        // Put 2-5 in their own span and keep it between 1 and 7

        var testing = document.createElement("span");
        $(testing).attr("class", "hide-post");

        $(testing).append($(post).find(".new-line")[0]);
        $(testing).append($(post).find(".small")[0]);
        $(testing).append($(post).find(".body-container")[0]);
        $(testing).append($(post).find(".list")[0]);

        // Finally append it to the post
        $(testing).insertAfter($(post).find(".toggle-minimized")[0]);
        $(testing).css("display", "none");
      }
      else
      {
        // If the container already exists
        $($(post).find(".hide-post")[0]).css("display", "none");
      }
    }
    else
    {
      // Maximizing the post
      $($(post).find(".hide-post")[0]).css("display", "");

      // Load FEK stuff for posts
      var list = $(post).find(".list")[0];

      $(list).each(function()
      {
        $(".body-container").each(function()
        {
          FormatSinglePost1(this, false);
          FormatSinglePost2(this, false);
          ColorVotes();
          HoverVotes();
          $(".toggle-minimized").each(function(){$(this).css("z-index", "1");});
        });
      });
    }
  })
}

////////////////////////////////////////////////////////////////////////
// FormatSinglePost1: Formats a single post before inserting FEK data //
////////////////////////////////////////////////////////////////////////
function FormatSinglePost1(obj, op)
{
  if(op === false)
  {
    // Show downvoted posts
    $(obj).parent().removeClass("isLowQuality");

    // See if the post is deleted
    var isThisDeleted = obj.children[0].children[1].getAttribute("style");

    if(isThisDeleted === null)
    {
      return;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////

  var usernameT = obj.getElementsByClassName("username")[0].textContent;
  var regionT   = obj.getElementsByClassName("realm")[0].textContent;
  regionT       = regionT.substring(1, regionT.length - 1);

  // If it's a person you blacklisted, hide the post if it's not the op
  if(blacklisting === "on")
  {
    if(GM_getValue(usernameT + " (" + regionT + ")", 0) == 1 && op === false)
    {
      $(obj).parent().remove();
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////

  // Define standard variables for this scope
  var riotVoting    = $(obj).parent()[0].getElementsByClassName("riot-voting")[0];
  var inlineProfile = obj.getElementsByClassName("inline-profile")[0];
  var profHover     = obj.getElementsByClassName("profile-hover")[0];
  var timeago       = obj.getElementsByClassName("timeago")[0];
  var icon          = obj.getElementsByTagName("img")[0];
  var body          = obj.getElementsByClassName("body")[0];
  var isRioter      = obj.getElementsByClassName("isRioter")[0];
  var username      = obj.getElementsByClassName("username")[0];
  var region        = obj.getElementsByClassName("realm")[0];

  // FEK staff have special gradient names, so I need to extract them using this method
  if(obj.getElementsByClassName("pxg-set").length > 0)
  {
    usernameT = inlineProfile.getElementsByClassName("pxg-set")[0].childNodes[0].textContent;
  }

  // Wrenchmen don't have a regular icon so if this person is a Wrenchmen, set their icon to "userGroupIcon"
  var tinyIcon; if((typeof(tinyIcon = obj.getElementsByClassName("icon")[0])) == "undefined") tinyIcon = obj.getElementsByClassName("userGroupIcon")[0];

  // Pop up for when you hover your mouse over a person's name/avatar (only do this once for the op)
  tinyIcon.style.setProperty("z-index", "1");

  // Declare variables that will be used later
  var opTitle;      // op
  var authorInfo;   // op
  var content;      // op
  var controlLinks; // op
  var attachments;  // not op
  var footer;       // not op

  var innerDiv;

  $(tinyIcon).each(function()
  {
    if(this.id != "popupHook")
    {
      this.id = "popupHook";

      $(this).hover(function()
      {
        var avatar = $($(this).find("img")[0]).attr("src");

        // Now create and append to innerDiv
        innerDiv = document.createElement("div");
        innerDiv.className = "popup";
        innerDiv.style.setProperty("position", "relative");
        innerDiv.style.setProperty("border", "solid 1px black");
        innerDiv.style.setProperty("width", avatarSize + "px");
        innerDiv.style.setProperty("height", avatarSize + "px");
        innerDiv.style.setProperty("left", "99%");
        innerDiv.style.setProperty("display", "none");
        innerDiv.style.setProperty("background-color", "white");
        innerDiv.style.setProperty("z-index", "-1");
        innerDiv.style.setProperty("padding-top", "0px");
        innerDiv.style.setProperty("padding-left", "5%");

        if(op) innerDiv.style.setProperty("top", -avatarSize - 8 + "px");
        else   innerDiv.style.setProperty("top", -avatarSize - 5 + "px");

        /*   font-size | line-height
        100:    14     |     18
        125:    18     |     23
        150:    22     |     28
        175:    26     |     33
        200:    30     |     38
        */
        innerDiv.style.setProperty("font-size",   (avatarSize - 100) / 25 * 4 + 14 + "px");
        innerDiv.style.setProperty("line-height", (avatarSize - 100) / 25 * 5 + 18 + "px");

        innerDiv.innerHTML = "<a href='#' id='prfle' style='color: black; letter-spacing: 0px; font-weight: bold; font-variant: normal; font-family: Spiegel-Regular, sans-serif'>View Profile</a><br>\
                              <a href='#' id='avatr' style='color: black; letter-spacing: 0px; font-weight: bold; font-variant: normal; font-family: Spiegel-Regular, sans-serif'>View Avatar</a><br>\
                              <a href='#' id='lolnx' style='color: black; letter-spacing: 0px; font-weight: bold; font-variant: normal; font-family: Spiegel-Regular, sans-serif'>LoLNexus</a><br>\
                              <a href='#' id='opgg'  style='color: black; letter-spacing: 0px; font-weight: bold; font-variant: normal; font-family: Spiegel-Regular, sans-serif'>OP.GG</a><br>\
                              <a href='#' id='black' style='color: black; letter-spacing: 0px; font-weight: bold; font-variant: normal; font-family: Spiegel-Regular, sans-serif'>Blacklist</a>";

        this.appendChild(innerDiv);

        profHover.setAttribute("href", "#");

        $(profHover).click(function(event)
        {
          event.preventDefault();
          event.stopPropagation();
        });

        $("#prfle").hover(function() {this.style.setProperty("text-decoration",  "underline");}, function() {this.style.setProperty("text-decoration",  "none");});
        $("#avatr").hover(function() {this.style.setProperty("text-decoration",  "underline");}, function() {this.style.setProperty("text-decoration",  "none");});
        $("#lolnx").hover(function() {this.style.setProperty("text-decoration",  "underline");}, function() {this.style.setProperty("text-decoration",  "none");});
        $("#opgg").hover(function()  {this.style.setProperty("text-decoration",  "underline");}, function() {this.style.setProperty("text-decoration",  "none");});
        $("#black").hover(function() {this.style.setProperty("text-decoration",  "underline");}, function() {this.style.setProperty("text-decoration",  "none");});

        $("#prfle").click(function(event)
        {
          event.preventDefault();
          event.stopPropagation();
          var win = window.open("http://boards." + platformRegion + ".leagueoflegends.com/en/player/" + regionT + "/" + usernameT, "_blank");
          win.focus();
        });

        $("#avatr").click(function(event)
        {
          event.preventDefault();
          event.stopPropagation();
          var win = window.open(avatar, "_blank");
          win.focus();
        });

        $("#lolnx").click(function(event)
        {
          event.preventDefault();
          event.stopPropagation();
          var win = window.open("http://www.lolnexus.com/" + regionT + "/search?name=" + usernameT, "_blank");
          win.focus();
        });

        $("#opgg").click(function(event)
        {
          event.preventDefault();
          event.stopPropagation();
          var win = window.open("http://" + regionT + ".op.gg/summoner/userName=" + usernameT, "_blank");
          win.focus();
        });

        $("#black").click(function(event)
        {
          event.preventDefault();
          event.stopPropagation();

          var target = usernameT + " (" + regionT + ")";

          // Add the person to our blacklist, or remove them from if they're already on there
          if(GM_getValue(target, 0) === 0)
          {
            GM_setValue(target, 1);
            alert(target + " has been added to your blacklist, refresh your page for this to take effect. If you added them by accident, click on the blacklist link again to undo the action.");
          }
          else
          {
            GM_deleteValue(target);
            alert(target + " has been removed from your blacklist");
          }
        });

        // Fade the FEK popup box in
        $(innerDiv).fadeIn(200);
      }, function()
      {
        innerDiv.remove();
      });
    }
  });

  if(removeProfHovPop == "on")
  {
    // Removes Riot's profile hover popup
    $(profHover).hover(function()
    {
      WaitAndRunManual(1000, function()
      {
        $(document.getElementsByClassName("information-container")).parent().parent().parent().remove();
      });
    });
  }

  // Modifying variables
  if(typeof riotVoting == "undefined")
  {
    var discussionTitle = obj.getElementsByClassName("discussion-title")[0];
    discussionTitle.style.setProperty("position",    "relative", "important");
    discussionTitle.style.setProperty("margin-left", "75px",     "important");
  }

  if(op === true)
  {
    originalPoster = usernameT;
    opTitle        = obj.getElementsByClassName("title")[0];
    authorInfo     = obj.getElementsByClassName("author-info")[0];
    content        = document.getElementById("content");
  }

  if(op === true)
  {
    controlLinks = obj.getElementsByClassName("control-links")[0];
    controlLinks.style.setProperty("padding-left", avatarSize + 85 + "px", "important");
  }

  if(op === false)
  {
    footer      = obj.getElementsByClassName("footer")[0];
    attachments = obj.getElementsByClassName("attachments")[0];
  }

  //if(op === false || (op === true && (document.getElementById("opHook") === null)))
  if(1)
  {
    // If they are a Rioter, do their avatars a bit differently
    if(typeof isRioter !== "undefined")
    {
      FormatAvatar(obj, true, tinyIcon, icon);
    }
    else
    {
      FormatAvatar(obj, false, tinyIcon, icon);
    }
  }

  if(op === true && (document.getElementById("opHook") === null))
  //if(op === true)
  {
    obj.getElementsByTagName("a")[1].remove(); // We want to remove the second anchor (link to name of sub-board it's in)
    $(authorInfo).contents().filter(function(){return this.nodeType == 3;}).remove();

    opTitle.style.setProperty("position", "relative", "important");
    opTitle.style.setProperty("left",     "-70px",    "important");

    var titleCreated    = obj.getElementsByTagName("span")[5];
    var submitted       = document.createElement("div");
    submitted.id        = "opHook";
    submitted.innerHTML = "Submitted ";
    submitted.style.setProperty("position",  "relative", "important");
    submitted.style.setProperty("left",      "-234px",   "important");
    submitted.style.setProperty("font-size", "18px",     "important");

    submitted.appendChild(titleCreated);
    authorInfo.appendChild(submitted);
  }

  if(op === false)
  {
    obj.style.setProperty("padding-left", "100px");
  }

  // Body: Original Post
  if(op === true)
  {
    body.style.setProperty("min-height",  avatarSize + 20 + "px", "important");
    body.style.setProperty("padding-top", "20px",  "important");
  }

  // Body: Regular Post
  if(op === false)
  {
    body.style.setProperty("position",     "relative", "important");
    body.style.setProperty("top",          "-12px",    "important");
    body.style.setProperty("padding-left", avatarSize - 60 + "px", "important");
    body.style.setProperty("min-height",   avatarSize + 10 + "px", "important");
    body.style.setProperty("margin-top",   "0px",      "important");
  }

  if(op === true)
  {
    content.style.setProperty("padding-left", "0px",   "important");
    content.style.setProperty("margin-left",  avatarSize + 90 + "px", "important");
  }

  // Inline Profile: Original Post
  if(op === true)
  {
    inlineProfile.style.setProperty("position", "relative", "important");
    inlineProfile.style.setProperty("top",      "70px",     "important");
    inlineProfile.style.setProperty("left",     "-42px",    "important");
    inlineProfile.style.setProperty("width",    "160px",    "important");
    inlineProfile.style.setProperty("height",   "20px",     "important");
  }

  // Inline Profile: Regular Post
  if(op === false)
  {
    inlineProfile.style.setProperty("position", "relative", "important");
    inlineProfile.style.setProperty("left",     "-120px",   "important");
    inlineProfile.style.setProperty("width",    "160px",    "important");
    inlineProfile.style.setProperty("height",   "20px",     "important");
  }

  // Profile Hover: All Posts
  if(1)
  {
    profHover.style.setProperty("position",  "absolute", "important");
    profHover.style.setProperty("height",    "20px",     "important");
  }

  // Riot members get a red title
  if(op === false)
  {
    if(isRioter)
      profHover.style.setProperty("color", "#AE250F", "important");
    else
      profHover.style.setProperty("color", "#94724D", "important");
  }

  // Username: All Posts
  if(1)
  {
    username.style.setProperty("position",       "relative",     "important");
    username.style.setProperty("width",          avatarSize + 60 + "px", "important");
    username.style.setProperty("height",         "20px",         "important");
    username.style.setProperty("font-size",      "14px",         "important");
    username.style.setProperty("text-align",     "center",       "important");
    username.style.setProperty("overflow",       "hidden",       "important");
    username.style.setProperty("display",        "block",        "important");
    username.style.setProperty("letter-spacing", "1px",          "important");
    username.style.setProperty("font-variant",   "normal",       "important");
    username.style.setProperty("font-family" ,   "'Constantia', 'Palatino', 'Georgia', serif", "important");

    if(op === true)
      username.style.setProperty("top", -avatarSize - 16 + "px", "important");
    else
      username.style.setProperty("top", -avatarSize - 12 + "px", "important");
  }

  // Background of username for regular posts
  if(op === false)
  {
    if(usernameT == originalPoster)
    {
      if(OPStyle == "on")
      {
        username.style.setProperty("background", "none", "important");
        username.style.setProperty("border",     "none", "important");
      }
      else
      {
        username.style.setProperty("color", "white", "important");
      }
    }
  }

  if(op === true)
  {
    region.style.setProperty("position", "relative", "important");
    region.style.setProperty("top",      "-20px",    "important");
    region.style.setProperty("left",     avatarSize + 55 + "px", "important");
    region.style.setProperty("letter-spacing", "1px",         "important");
    region.style.setProperty("font-size",    "16px",         "important");
    region.style.setProperty("font-variant", "normal",       "important");
    region.style.setProperty("font-family" , "'Constantia', 'Palatino', 'Georgia', serif", "important");
  }

  if(op === false)
  {
    region.style.setProperty("position", "relative", "important");
    region.style.setProperty("top",      "-17px",    "important");
    region.style.setProperty("left",     avatarSize + 65 + "px", "important");
  }

  // Voting: Original Post
  if(op === true && typeof riotVoting != "undefined")
  {
    riotVoting.style.setProperty("position", "absolute", "important");
    riotVoting.style.setProperty("top",      "138px",    "important");
    riotVoting.style.setProperty("left",     "10px",    "important");
  }

  // Voting: Regular Post
  if(op === false && typeof riotVoting != "undefined")
  {
    riotVoting.style.setProperty("position", "absolute", "important");
    riotVoting.style.setProperty("top",      "50px",     "important");
  }

  // Miscellaneous: Regular Post
  if(op === false)
  {
    timeago.style.setProperty("position", "relative", "important");
    timeago.style.setProperty("top",      "-18px",    "important");
    timeago.style.setProperty("left",     avatarSize - 160 + "px", "important");

    footer.style.setProperty("padding-left", avatarSize - 65 + "px", "important");

    if($(attachments).length)
      attachments.style.setProperty("padding-left", avatarSize - 60 + "px", "important");
  }

  RollDice(obj);
}

/////////////////////////////////////////////////////////////////
// FormatSinglePost2: Inserts FEK data into the formatted post //
/////////////////////////////////////////////////////////////////
function FormatSinglePost2(obj, op)
{
  var usernameT     = obj.getElementsByClassName("username")[0].textContent;
  var regionT       = obj.getElementsByClassName("realm")[0].textContent;
  regionT           = regionT.substring(1, regionT.length - 1);

  ////////////////////////////////////////////////////////////////////////////////////////////////////

  // Define standard variables for this scope
  var riotVoting    = $(obj).parent()[0].getElementsByClassName("riot-voting")[0];
  var inlineProfile = obj.getElementsByClassName("inline-profile")[0];
  var profHover     = obj.getElementsByClassName("profile-hover")[0];
  var timeago       = obj.getElementsByClassName("timeago")[0];
  var icon          = obj.getElementsByTagName("img")[0];
  var body          = obj.getElementsByClassName("body")[0];
  var isRioter      = obj.getElementsByClassName("isRioter")[0];
  var username      = obj.getElementsByClassName("username")[0];
  var region        = obj.getElementsByClassName("realm")[0];

  // FEK staff have special gradient names, so I need to extract them using this method
  if(obj.getElementsByClassName("pxg-set").length > 0)
  {
    usernameT = inlineProfile.getElementsByClassName("pxg-set")[0].childNodes[0].textContent;
  }

  // Wrenchmen don't have a regular icon so if this person is a Wrenchmen, set their icon to "userGroupIcon"
  var tinyIcon; if((typeof (tinyIcon = obj.getElementsByClassName("icon")[0])) == "undefined") tinyIcon = obj.getElementsByClassName("userGroupIcon")[0];

  // Pop up for when you hover your mouse over a person's name/avatar (only do this once for the op)
  tinyIcon.style.setProperty("z-index", "1");

  // Declare variables that will be used later
  var opTitle;      // op
  var authorInfo;   // op
  var content;      // op
  var controlLinks; // op
  var attachments;  // not op
  var footer;       // not op

  // Define user data variables
  var avatar = results[usernameT][regionT].avatar;
  var donor  = results[usernameT][regionT].donor;
  var staff  = results[usernameT][regionT].staff;
  var title  = results[usernameT][regionT].title;
  var badge  = results[usernameT][regionT].badge;

  var innerDiv;
  /*
  $(tinyIcon).each(function()
  {
    if(this.id != "popupHook")
    {
      this.id = "popupHook";

      $(this).hover(function()
      {
        // Now create and append to innerDiv
        innerDiv = document.createElement("div");
        innerDiv.className = "popup";
        innerDiv.style.setProperty("position", "relative");
        innerDiv.style.setProperty("border", "solid 1px black");
        innerDiv.style.setProperty("width", avatarSize + "px");
        innerDiv.style.setProperty("height", avatarSize + "px");
        innerDiv.style.setProperty("left", "99%");
        innerDiv.style.setProperty("display", "none");
        innerDiv.style.setProperty("background-color", "white");
        innerDiv.style.setProperty("z-index", "-1");
        innerDiv.style.setProperty("padding-top", "0px");
        innerDiv.style.setProperty("padding-left", "5%");

        if(op) innerDiv.style.setProperty("top", -avatarSize - 8 + "px");
        else   innerDiv.style.setProperty("top", -avatarSize - 5 + "px");

        /*   font-size | line-height
        100:    14     |     18
        125:    18     |     23
        150:    22     |     28
        175:    26     |     33
        200:    30     |     38
        *
        innerDiv.style.setProperty("font-size",   (avatarSize - 100) / 25 * 4 + 14 + "px");
        innerDiv.style.setProperty("line-height", (avatarSize - 100) / 25 * 5 + 18 + "px");

        innerDiv.innerHTML = "<a href='#' id='prfle' style='color: black; letter-spacing: 0px; font-weight: bold; font-variant: normal; font-family: Spiegel-Regular, sans-serif'>View Profile</a><br>\
                              <a href='#' id='avatr' style='color: black; letter-spacing: 0px; font-weight: bold; font-variant: normal; font-family: Spiegel-Regular, sans-serif'>View Avatar</a><br>\
                              <a href='#' id='lolnx' style='color: black; letter-spacing: 0px; font-weight: bold; font-variant: normal; font-family: Spiegel-Regular, sans-serif'>LoLNexus</a><br>\
                              <a href='#' id='opgg'  style='color: black; letter-spacing: 0px; font-weight: bold; font-variant: normal; font-family: Spiegel-Regular, sans-serif'>OP.GG</a><br>\
                              <a href='#' id='black' style='color: black; letter-spacing: 0px; font-weight: bold; font-variant: normal; font-family: Spiegel-Regular, sans-serif'>Blacklist</a>";

        this.appendChild(innerDiv);

        profHover.setAttribute("href", "#");

        $(profHover).click(function(event)
        {
          event.preventDefault();
          event.stopPropagation();
        });

        $("#prfle").hover(function() {this.style.setProperty("text-decoration",  "underline");}, function() {this.style.setProperty("text-decoration",  "none");});
        $("#avatr").hover(function() {this.style.setProperty("text-decoration",  "underline");}, function() {this.style.setProperty("text-decoration",  "none");});
        $("#lolnx").hover(function() {this.style.setProperty("text-decoration",  "underline");}, function() {this.style.setProperty("text-decoration",  "none");});
        $("#opgg").hover(function()  {this.style.setProperty("text-decoration",  "underline");}, function() {this.style.setProperty("text-decoration",  "none");});
        $("#black").hover(function() {this.style.setProperty("text-decoration",  "underline");}, function() {this.style.setProperty("text-decoration",  "none");});

        $("#prfle").click(function(event)
        {
          event.preventDefault();
          event.stopPropagation();
          var win = window.open("http://boards." + platformRegion + ".leagueoflegends.com/en/player/" + regionT + "/" + usernameT, "_blank");
          win.focus();
        });

        $("#avatr").click(function(event)
        {
          event.preventDefault();
          event.stopPropagation();
          var win = window.open(avatar, "_blank");
          win.focus();
        });

        $("#lolnx").click(function(event)
        {
          event.preventDefault();
          event.stopPropagation();
          var win = window.open("http://www.lolnexus.com/" + regionT + "/search?name=" + usernameT, "_blank");
          win.focus();
        });

        $("#opgg").click(function(event)
        {
          event.preventDefault();
          event.stopPropagation();
          var win = window.open("http://" + regionT + ".op.gg/summoner/userName=" + usernameT, "_blank");
          win.focus();
        });

        $("#black").click(function(event)
        {
          event.preventDefault();
          event.stopPropagation();

          var target = usernameT + " (" + regionT + ")";

          // Add the person to our blacklist, or remove them from if they're already on there
          if(GM_getValue(target, 0) === 0)
          {
            GM_setValue(target, 1);
            alert(target + " has been added to your blacklist, refresh your page for this to take effect. If you added them by accident, click on the blacklist link again to undo the action.");
          }
          else
          {
            GM_deleteValue(target);
            alert(target + " has been removed from your blacklist");
          }
        });

        // Fade the FEK popup box in
        $(innerDiv).fadeIn(200);
      }, function()
      {
        innerDiv.remove();
      });
    }
  });

  */

  // Assign avatars
  if(typeof isRioter !== "undefined")
  {
    AssignAvatar(obj, true, avatar, tinyIcon);
  }
  else
  {
    AssignAvatar(obj, false, avatar, tinyIcon);
  }

  // Alter text colors for names and titles
  if(op === false)
  {
    if(isRioter)
      profHover.style.setProperty("color", "#AE250F", "important"); // Makes sure that Rioter's titles are red
    else if(staff == "1")
      profHover.style.setProperty("color", "#0000FF", "important"); // FEK staff
    else
      profHover.style.setProperty("color", "#94724D", "important"); // Regular users
  }

  // Username: All Posts
  if(1)
  {
    if(staff == "1")
    {
      // Gradient names have problems where if they are too long and have a space, they will
      // go on a second line. So if a name is a certain length (>= 14) and has at least one
      // space in it, decrease the font size to 12
      if(usernameT.length >= 12 && (usernameT.indexOf(' ') >= 0))
        username.style.setProperty("font-size", "12px", "important");

      $(username).GradientText(
      {
        step:    10,
        colors: ["#68BAFF", "#008AFF", "#68BAFF"],
        dir:    "x"
      });
    }
  }

  GetBadgesAndTitle(usernameT, regionT, profHover, donor, staff, title, badge);
}

//////////////////////////////////
// RollDice: Rolls virtual dice //
//////////////////////////////////
function RollDice(obj)
{
  // PRNG
  !function(a,b,c,d,e,f,g,h,i){function j(a){var b,c=a.length,e=this,f=0,g=e.i=e.j=0,h=e.S=[];for(c||(a=[c++]);d>f;)h[f]=f++;for(f=0;d>f;f++)h[f]=h[g=s&g+a[f%c]+(b=h[f])],h[g]=b;(e.g=function(a){for(var b,c=0,f=e.i,g=e.j,h=e.S;a--;)b=h[f=s&f+1],c=c*d+h[s&(h[f]=h[g=s&g+b])+(h[g]=b)];return e.i=f,e.j=g,c})(d)}function k(a,b){var c,d=[],e=typeof a;if(b&&"object"==e)for(c in a)try{d.push(k(a[c],b-1))}catch(f){}return d.length?d:"string"==e?a:a+"\0"}function l(a,b){for(var c,d=a+"",e=0;e<d.length;)b[s&e]=s&(c^=19*b[s&e])+d.charCodeAt(e++);return n(b)}function m(c){try{return o?n(o.randomBytes(d)):(a.crypto.getRandomValues(c=new Uint8Array(d)),n(c))}catch(e){return[+new Date,a,(c=a.navigator)&&c.plugins,a.screen,n(b)]}}function n(a){return String.fromCharCode.apply(0,a)}var o,p=c.pow(d,e),q=c.pow(2,f),r=2*q,s=d-1,t=c["seed"+i]=function(a,f,g){var h=[];f=1==f?{entropy:!0}:f||{};var o=l(k(f.entropy?[a,n(b)]:null==a?m():a,3),h),s=new j(h);return l(n(s.S),b),(f.pass||g||function(a,b,d){return d?(c[i]=a,b):a})(function(){for(var a=s.g(e),b=p,c=0;q>a;)a=(a+c)*d,b*=d,c=s.g(1);for(;a>=r;)a/=2,b/=2,c>>>=1;return(a+c)/b},o,"global"in f?f.global:this==c)};if(l(c[i](),b),g&&g.exports){g.exports=t;try{o=require("crypto")}catch(u){}}else h&&h.amd&&h(function(){return t})}(this,[],Math,256,6,52,"object"==typeof module&&module,"function"==typeof define&&define,"random");

  var spanElements = obj.getElementsByTagName("span");
  var seed;

  for(var i = 0; i < spanElements.length; ++i)
  {
    if(spanElements[i].getAttribute("title") !== null)
    {
      seed = spanElements[i].getAttribute("title");
      i = spanElements.length;
    }
  }

  // DICE ROLLING RULES!
  // Only one roll per post. This is to prevent too many rolls to crash the browser.
  // Don't do rolls in <blockquote>

  // [roll]     = Die Result: 500 (1d1000)
  // [roll:6]   = Die Result: 4 (1d6)
  // [roll:2d6] = Die Result: 7 (1d6)
  // [roll:100] = Die Result: 50 (1d100)

  // Extract text in between [roll: and ]

  // Convert the DateTime seed to a random number
  seed = parseInt(seed.substr(seed.length - 8, 3)) + 1;

  var paragraphs = obj.getElementsByTagName("p");
  var rolled = false;

  for(var i = 0; i < paragraphs.length; ++i)
  {
    var regex   = /\[roll(.*?)\]/gi
    var command = regex.exec(paragraphs[i].innerHTML);

    // Example of the Array command
    // command[0] : "[roll:2d100]"
    // command[1] : "2d100"

    if((rolled || rollDice == "off" || (paragraphs[i].parentElement.tagName == "BLOCKQUOTE")) && command !== null)
    {
      paragraphs[i].innerHTML = paragraphs[i].innerHTML.replace(command[0], "");
    }
    else if(rollDice == "on" && command !== null)
    {
      var rolls    = 0;
      var die      = 0;
      var regex    = /([0-9]*)d([0-9]*)/gi
      var extended = regex.exec(command[1]);

      // Example of the Array extended (assuming it exists)
      // extended[0] : "2d100"
      // extended[1] : "2"
      // extended[2] : "100"

      // Check if it's something like 2d100, instead of having a single number
      if(extended !== null)
      {
        if(extended[1]) rolls = extended[1];
        else            rolls = 1;

        if(extended[2]) die = extended[2];
        else            die = 1;
      }
      else
      {
        var regex  = /([0-9]*)/g
        var simple = regex.exec(command[1]);

        if(command[1] == simple[1])
        {
          rolls              = 1;

          if(command[1]) die = command[1];
          else           die = 1;
        }
      }

      var result = 0;

      // Limit the die rolls and sides to 100
      if(rolls > 100) rolls = 100;
      if(die   > 100) die   = 100;

      // [roll] is a special die roll of 1d1000
      if(command[0] == "[roll]")
      {
        rolls = 1;
        die   = 1000;
      }

      if(rolls != 0)
      {
        for(var j = 0; j < rolls; ++j)
        {
          Math.seedrandom(seed);
          result += Math.ceil(Math.random() * die);
          seed += 1;
        }

        // Replace the text
        var dieRoll = '<font color="#ff0000">Die Result: </font>' + '<font color="#00ff00">' + result + '</font>' + '<font color="#00ffff">' + ' (' + rolls + 'd' + die + ')' + '</font>';
        paragraphs[i].innerHTML = paragraphs[i].innerHTML.replace(command[0], dieRoll);

        rolled = true;
      }
    }
  }
}

/////////////////////////////////////
// FormatAvatar: Formats an avatar //
/////////////////////////////////////
function FormatAvatar(obj, isRioter, tinyIcon, icon)
{
  tinyIcon.style.setProperty("position",         "relative",        "important");
  tinyIcon.style.setProperty("top",              "12px",            "important");
  tinyIcon.style.setProperty("left",             "30px",            "important");
  tinyIcon.style.setProperty("width",            avatarSize + "px", "important");
  tinyIcon.style.setProperty("height",           avatarSize + "px", "important");
  tinyIcon.style.setProperty("background-image", "none",            "important");

  if(isRioter)
  {
    if(!tinyIcon.getElementsByTagName("img")[0] && !tinyIcon.getElementsByTagName("video")[0])
    {
      var imgIcon = document.createElement("img");
      imgIcon.setAttribute("src", "http://i.imgur.com/STcpwlY.png");
      imgIcon.style.setProperty("width",     avatarSize + "px",    "important");
      imgIcon.style.setProperty("height",    avatarSize + "px",    "important");
      imgIcon.style.setProperty("border",    "thin solid #FF0000", "important");
      tinyIcon.appendChild(imgIcon);
    }
  }
  else
  {
    icon.style.setProperty("width",  avatarSize + "px",    "important");
    icon.style.setProperty("height", avatarSize + "px",    "important");
    icon.style.setProperty("border", "thin solid #FFFFFF", "important");

    if(fallbackAvatar != "off")
    {
      obj.getElementsByTagName("img")[0].setAttribute("src", fallbackAvatar);
    }
  }
}

/////////////////////////////////////
// AssignAvatar: Assigns an avatar //
/////////////////////////////////////
function AssignAvatar(obj, isRioter, avatar, tinyIcon)
{
  if(isRioter)
  {
     if(typeof avatar !== "undefined")
     {
       if(avatar.slice(-5) == ".webm")
       {
         FormatWebmAvatar(obj, avatar);
       }
       else
       {
         obj.getElementsByTagName("img")[0].setAttribute("src", avatar);
       }
     }
  }
  else
  {
    if(typeof avatar !== "undefined")
    {
      if(avatar.slice(-5) == ".webm")
      {
        FormatWebmAvatar(obj, avatar);
      }
      else
      {
        obj.getElementsByTagName("img")[0].setAttribute("src", avatar);
      }
    }
    else if(fallbackAvatar != "off")
    {
      obj.getElementsByTagName("img")[0].setAttribute("src", fallbackAvatar);
    }
  }
}

////////////////////////////////////////////////////
// FormatWebmAvatar: Gives the user a webm avatar //
////////////////////////////////////////////////////
function FormatWebmAvatar(obj, avatar)
{
  // This check ensures no duplicate .webm avatars will be embedded into a user's post
  if(!obj.getElementsByTagName("video")[0])
  {
    var webm = obj.getElementsByTagName("img")[0];
    webm.setAttribute("src",  avatar, "important");
    webm.setAttribute("loop", "true");
    webm.setAttribute("data-bind", "", "important");
    $(webm).ChangeElementType("video");
    obj.getElementsByTagName("video")[0].play();
  }
}

/////////////////////////////////////////////
// ========== FEK CONTROL PANEL ========== //
/////////////////////////////////////////////

////////////////////////////////////////////////////////////
// CreateFeatures: This is where all FEK features are set //
////////////////////////////////////////////////////////////
function CreateFeatures()
{
  var tabgroup, tab, category, initvalue, label, options, tooltip;

  // Core Mods -> LoL Boards -> User Identities
  tabgroup = "Core Mods";
  tab      = "LoL Boards";
  category = "User Identities";

  //////////////////////////
  // Feature: FEK Avatars //
  //////////////////////////
  tooltip = "The size of FEK avatars.";
  options = ["100|100x100",
             "125|125x125",
             "150|150x150",
             "175|175x175",
             "200|200x200"];

  CreateFeature("FEK Avatars", "_fekAvatars", options, "100", tooltip, tabgroup, tab, category,
  function(option)
  {
    avatarSize = parseInt(option);
  });

  ///////////////////////////////
  // Feature: Fallback Avatars //
  ///////////////////////////////
  tooltip = "The avatar to use when a person doesn't have a FEK avatar.";
  options = ["off|Disable",
             "1|Trident (Dark)",
             "2|Trident (Light)",
             "3|Trident (Parchment)",
             "4|Poro (Dark)",
             "5|Poro (Light)",
             "6|Poro (Parchment)",
             "7|Happy Cloud (Dark)",
             "8|Happy Cloud (Light)",
             "9|Happy Cloud (Parchment)"];

  CreateFeature("Fallback Avatars", "_fallbackAvatars", options, "off", tooltip, tabgroup, tab, category,
  function(option)
  {
    if     (option == "1") fallbackAvatar = FEKgfx + "no-avatar-trident-dark.gif";
    else if(option == "2") fallbackAvatar = FEKgfx + "no-avatar-trident-light.gif";
    else if(option == "3") fallbackAvatar = FEKgfx + "no-avatar-trident-parchment.gif";
    else if(option == "4") fallbackAvatar = FEKgfx + "no-avatar-poro-dark.gif";
    else if(option == "5") fallbackAvatar = FEKgfx + "no-avatar-poro-light.gif";
    else if(option == "6") fallbackAvatar = FEKgfx + "no-avatar-poro-parchment.gif";
    else if(option == "7") fallbackAvatar = FEKgfx + "no-avatar-dark.gif";
    else if(option == "8") fallbackAvatar = FEKgfx + "no-avatar-light.gif";
    else if(option == "9") fallbackAvatar = FEKgfx + "no-avatar-parchment.gif";
  });

  //////////////////////////////
  // Feature: Enhanced Voting //
  //////////////////////////////
  tooltip = "Gives a green color to upvotes, and a red color to downvotes. Also gives you the choice of how to display votes when you hover your mouse over them.";
  options = ["off|Disable",
             "individual|Individual Votes",
             "total|Total Votes",
             "hide|Hide Votes"];

  CreateFeature("Enhanced Voting", "_enhancedVoting", options, "individual", tooltip, tabgroup, tab, category,
  function(option)
  {
    votingDisplay = option;
  });

  ///////////////////////////
  // Feature: Blacklisting //
  ///////////////////////////
  tooltip = "Hides posts and threads made by users that you have on your blacklist. To blacklist somebody, hover your mouse over their avatar and click on blacklist";
  CreateFeature("Blacklisting", "_blacklisting", "", "on", tooltip, tabgroup, tab, category,
  function(option)
  {
    blacklisting = option;
  });

  //////////////////////////////
  // Feature: OP Style Change //
  //////////////////////////////
  tooltip = "Removes the colored background on an original poster's posts.";
  CreateFeature("OP Style Change", "_opStyleChange", "", "on", tooltip, tabgroup, tab, category,
  function(option)
  {
    OPStyle = option;
  });

  /////////////////////////////////////////
  // Feature: Remove Profile Hover Popup //
  /////////////////////////////////////////
  tooltip = "Removes Riot's profile popup when you hover over a user.";
  CreateFeature("Remove Profile Hover Popup", "_removeProfHovPop", "", "on", tooltip, tabgroup, tab, category,
  function(option)
  {
    removeProfHovPop = option;
  });

  // Core Mods -> LoL Boards -> Navigation Enhancements
  tabgroup = "Core Mods";
  tab      = "LoL Boards";
  category = "Navigation Enhancements";

  //////////////////////////////////////
  // Feature: Enhanced Thread Preview //
  //////////////////////////////////////
  category = "Navigation Enhancements";
  tooltip  = "Replaces the default thread preview tooltip with a more visible and enhanced one.";
  CreateFeature("Enhanced Thread Preview", "_enhancedThreadPreview", "", "on", tooltip, tabgroup, tab, category,
  function(option)
  {
    enhancedThreadPreview = option;
  });

  //////////////////////////////////
  // Feature: Thread Highlighting //
  //////////////////////////////////
  category = "Navigation Enhancements";
  tooltip  = "Threads created by you will have a colored background to stand out from the rest.";
  options = ["off|Disable",
             "#000000|Black",
             "#400000|Red",
             "#442000|Orange",
             "#303000|Yellow",
             "#002800|Green",
             "#003737|Cyan",
             "#000A50|Blue",
             "#551A8B|Purple",
             "#9400D3|Violet"];

  CreateFeature("Highlight My Threads", "_threadHighlight", options, "#000000", tooltip, tabgroup, tab, category,
  function(option)
  {
    highlightMyThreads = option;
  });


  ///////////////////////////////////
  // Feature: Boards Dropdown Menu //
  ///////////////////////////////////
  category = "Navigation Enhancements";
  tooltip  = "Adds a dropdown menu when you hover your mouse over the Boards button at the top of the page on the navigation bar.";
  CreateFeature("Boards Dropdown Menu", "_boardsDropdownMenu", "", "on", tooltip, tabgroup, tab, category,
  function(option)
  {
    boardsDropdownMenu = option;
  });

  /////////////////////////////////
  // Feature: Animate Thumbnails //
  /////////////////////////////////
  category = "Navigation Enhancements";
  tooltip  = "Animates thumbnails (if they have one) for a thread's image on the index. You may also choose to hide thumbnails completely.";
  options = ["off|Disable",
             "animate|Animate thumbnails",
             "hide|Hide thumbnails"];
  CreateFeature("Thumbnails", "_thumbnails", options, "animate", tooltip, tabgroup, tab, category,
  function(option)
  {
    animateThumbnails = option;
  });

  ////////////////////////////
  // Feature: Sticky Navbar //
  ////////////////////////////
  category = "Navigation Enhancements";
  tooltip  = "Keeps the Navbar at the top of the browser window even when you scroll down.";
  CreateFeature("Sticky Navbar", "_stickyNavbar", "", "off", tooltip, tabgroup, tab, category,
  function(option)
  {
    document.getElementById("riotbar-bar").style.setProperty("position", "fixed");
    document.getElementById("riotbar-bar").style.setProperty("top",      "0px");
  });

  ///////////////////////////////////////
  // Feature: Empty Vote Replacement //
  ///////////////////////////////////////
  category = "Navigation Enhancements";
  tooltip  = "If votes aren't displayed, extra stuff can be added to fill the gap.";
  options = ["off|Disable",
             "banners|Green banners",
             "bannersavatars|Green banners and avatars"];
  CreateFeature("Empty Vote Replacement", "_emptyvotereplacement", options, "off", tooltip, tabgroup, tab, category,
  function(option)
  {
    emptyVoteReplacement = option;
  });

  // Core Mods -> LoL Boards -> Multimedia
  tabgroup = "Core Mods";
  tab      = "LoL Boards";
  category = "Multimedia";

  //////////////////////////////
  // Feature: Media Embedding //
  //////////////////////////////
  tooltip = "Embeds .webm and YouTube movies into the posts themselves, rather than showing up as just links.";
  CreateFeature("Media Embedding", "_mediaEmbedding", "", "on", tooltip, tabgroup, tab, category,
  function(option)
  {
    embedMedia = option;
  });

  // Core Mods -> LoL Boards -> Miscellaneous
  tabgroup = "Core Mods";
  tab      = "LoL Boards";
  category = "Miscellaneous";

  ////////////////////////////////
  // Feature: Favorite Champion //
  ////////////////////////////////
  tooltip  = "Champion icon that will be used when making posts.";
  options = ["aatrox|Aatrox",
             "ahri|Ahri",
             "akali|Akali",
             "alistar|Alistar",
             "amumu|Amumu",
             "anivia|Anivia",
             "annie|Annie",
             "ashe|Ashe",
             "azir|Azir",
             "bard|Bard",
             "blitzcrank|Blitzcrank",
             "brand|Brand",
             "braum|Braum",
             "caitlyn|Caitlyn",
             "cassiopeia|Cassiopeia",
             "chogath|Cho'Gath",
             "corki|Corki",
             "darius|Darius",
             "diana|Diana",
             "drmundo|Dr. Mundo",
             "draven|Draven",
             "ekko|Ekko",
             "elise|Elise",
             "evelynn|Evelynn",
             "ezreal|Ezreal",
             "fiddlesticks|Fiddlesticks",
             "fiora|Fiora",
             "fizz|Fizz",
             "galio|Galio",
             "gangplank|Gangplank",
             "garen|Garen",
             "gnar|Gnar",
             "gragas|Gragas",
             "graves|Graves",
             "hecarim|Hecarim",
             "heimerdinger|Heimerdinger",
             "irelia|Irelia",
             "janna|Janna",
             "jarvaniv|Jarvan IV",
             "jax|Jax",
             "jayce|Jayce",
             "jinx|Jinx",
             "kalista|Kalista",
             "karma|Karma",
             "karthus|Karthus",
             "kassadin|Kassadin",
             "katarina|Katarina",
             "kayle|Kayle",
             "kennen|Kennen",
             "khazix|Kha'Zix",
             "kindred|Kindred",
             "kogmaw|Kog'Maw",
             "leblanc|LeBlanc",
             "leesin|Lee Sin",
             "leona|Leona",
             "lissandra|Lissandra",
             "lucian|Lucian",
             "lulu|Lulu",
             "lux|Lux",
             "malphite|Malphite",
             "malzahar|Malzahar",
             "maokai|Maokai",
             "masteryi|Master Yi",
             "missfortune|Miss Fortune",
             "mordekaiser|Mordekaiser",
             "morgana|Morgana",
             "nami|Nami",
             "nasus|Nasus",
             "nautilus|Nautilus",
             "nidalee|Nidalee",
             "nocturne|Nocturne",
             "nunu|Nunu",
             "olaf|Olaf",
             "orianna|Orianna",
             "pantheon|Pantheon",
             "poppy|Poppy",
             "quinn|Quinn",
             "rammus|Rammus",
             "reksai|Rek'Sai",
             "renekton|Renekton",
             "rengar|Rengar",
             "riven|Riven",
             "rumble|Rumble",
             "ryze|Ryze",
             "sejuani|Sejuani",
             "shaco|Shaco",
             "shen|Shen",
             "shyvana|Shyvana",
             "singed|Singed",
             "sion|Sion",
             "sivir|Sivir",
             "skarner|Skarner",
             "sona|Sona",
             "soraka|Soraka",
             "swain|Swain",
             "syndra|Syndra",
             "tahmkench|Tahm Kench",
             "talon|Talon",
             "taric|Taric",
             "teemo|Teemo",
             "thresh|Thresh",
             "tristana|Tristana",
             "trundle|Trundle",
             "tryndamere|Tryndamere",
             "twistedfate|Twisted Fate",
             "twitch|Twitch",
             "udyr|Udyr",
             "urgot|Urgot",
             "varus|Varus",
             "vayne|Vayne",
             "veigar|Veigar",
             "velkoz|Vel'Koz",
             "vi|Vi",
             "viktor|Viktor",
             "vladimir|Vladimir",
             "volibear|Volibear",
             "warwick|Warwick",
             "wukong|Wukong",
             "xerath|Xerath",
             "xinzhao|Xin Zhao",
             "yasuo|Yasuo",
             "yorick|Yorick",
             "zac|Zac",
             "zed|Zed",
             "ziggs|Ziggs",
             "zilean|Zilean",
             "zyra|Zyra"];
  CreateFeature("Favorite Champion", "_favoritechampion", options, "fizz", tooltip, tabgroup, tab, category,
  function(option)
  {
    favoriteChampion = option;
  });

  //////////////////////////////////////
  // Feature: Favorite Summoner Spell //
  //////////////////////////////////////
  tooltip  = "Spell icon that will be used when making posts.";
  options = ["barrier|Barrier",
             "clairvoyance|Clairvoyance",
             "clarity|Clarity",
             "cleanse|Cleanse",
             "exhaust|Exhaust",
             "flash|Flash",
             "garrison|Garrison",
             "ghost|Ghost",
             "heal|Heal",
             "ignite|Ignite",
             "mark|Mark",
             "porotoss|Poro Toss",
             "smite|Smite",
             "teleport|Teleport",
             "totheking|To the King"];
  CreateFeature("Favorite Summoner Spell", "_favoritesummonerspell", options, "ignite", tooltip, tabgroup, tab, category,
  function(option)
  {
    favoriteSpell = option;
  });

  ////////////////////////////
  // Feature: Favorite Item //
  ////////////////////////////
  tooltip  = "Item icon that will be used when making posts.";
  options = ["blackcleaver|Black Cleaver",
             "bladeoftheruinedking|Blade of the Ruined King",
             "bootsofmobility|Boots of Mobility",
             "bootsofswiftness|Boots of Swiftness",
             "deathfiregrasp|Deathfire Grasp",
             "deathsdance|Death's Dance",
             "deathsdaughter|Death's Daughter",
             "doransring|Doran's Ring",
             "essencereaver|Essence Reaver",
             "frostqueensclaim|Frost Queen's Claim",
             "headofkhazix|Head of Kha'Zix",
             "hextechglp800|Hextech GLP-800",
             "hextechgunblade|Hextech Gunblade",
             "hextechprotobelt01|Hextech Protobelt-01",
             "huntersmachete|Hunter's Machete",
             "infinityedge|Infinity Edge",
             "lastwhisper|Last Whisper",
             "liandrystorment|Liandry's Torment",
             "lichbane|Lich Bane",
             "locketoftheironsolari|Locket of the Iron Solari",
             "lostchapter|Lost Chapter",
             "orbofwinter|Orb of Winter",
             "phantomdancer|Phantom Dancer",
             "rabadonsdeathcap|Rabadon's Deathcap",
             "ravenoushydra|Ravenous Hydra",
             "sightstone|Sightstone",
             "talismanofascension|Talisman of Ascension",
             "tearofthegoddess|Tear of the Goddess",
             "theblackcleaver|The Black Cleaver",
             "thornmail|Thornmail",
             "trinityforce|Trinity Force",
             "warmogsarmor|Warmog's Armor",
             "youmuusghostblade|Youmuu's Ghostblade",
             "zeal|Zeal",
             "zhonyashourglass|Zhonya's Hourglass",
             "zzrotportal|Zz'Rot Portal"];
  CreateFeature("Favorite Item", "_favoriteitem", options, "lichbane", tooltip, tabgroup, tab, category,
  function(option)
  {
    favoriteItem = option;
  });

  /////////////////////////////
  // Feature: Favorite Icons //
  /////////////////////////////
  tooltip  = "How favorite icons (champion/spell/item) are displayed.";
  options = ["off|Disable",
             "on|Always On",
             "mouseover|Mouse Over"];
  CreateFeature("Favorite Icons", "_favoriteicons", options, "mouseover", tooltip, tabgroup, tab, category,
  function(option)
  {
    favoriteIcons = option;
  });

  ////////////////////////
  // Feature: Roll Dice //
  ////////////////////////
  tooltip = "Shows dice rolls. Disable this feature to completely hide them.";
  CreateFeature("Roll Dice", "_rollDice", "", "on", tooltip, tabgroup, tab, category,
  function(option)
  {
    rollDice = option;
  });

  ///////////////////////////
  // Feature: Blacklisting //
  ///////////////////////////
  if(blacklisting == "on")
  {
    PanelCreateTab(tabgroup, "Blacklist", function(contentview)
    {
      $("#tab[tab='core-mods-blacklist']").click(function()
      {
        contentview.html("<h1>Blacklisted Users</h1><br>Click on a name to remove it from your blacklist<br><br>");

        var vals = GM_listValues();
        for(var i = 0; i < vals.length; i++)
        {
          if(vals[i][0] != '_')
          {
            myThing = document.createElement("div");
            myThing.innerHTML = "<a href='#'>" + vals[i] + "</a><br>";

            $(myThing).click(function(event)
            {
              event.preventDefault();
              event.stopPropagation();
              GM_deleteValue(this.textContent);
              this.remove();
            });

            contentview[0].appendChild(myThing);
          }
        }
      });
    });
  }

  // Core Mods -> Hidden Boards -> These boards are hidden from the front page
  tabgroup = "Core Mods";
  tab      = "Hidden Boards";
  category = "These boards are hidden from the front page";

  /////////////////////////////
  // Feature: Hide Subboards //
  /////////////////////////////
  function HideSubboard(boardName, optionVar)
  {
    tooltip  = "Hide threads from " + boardName;

    CreateFeature(boardName, optionVar, "", "off", tooltip, tabgroup, tab, category,
    function(option)
    {
      hide[boardName] = option;
    });
  }

  HideSubboard("Gameplay",                     "_gameplay");
  HideSubboard("Story, Art, & Sound",          "_storyartsound");
  HideSubboard("Esports",                      "_esports");
  HideSubboard("Team Recruitment",             "_teamrecruitment");
  HideSubboard("Concepts & Creations",         "_conceptscreations");
  HideSubboard("Player Behavior & Moderation", "_playerbehaviormoderation");
  HideSubboard("Miscellaneous",                "_miscellaneous");
  HideSubboard("Memes & Games",                "_memesgames");
  HideSubboard("General Discussion",           "_generaldiscussion");
  HideSubboard("Roleplay",                     "_roleplay");
  HideSubboard("Help & Support",               "_helpsupport");
  HideSubboard("Report a Bug",                 "_reportabug");
  HideSubboard("Boards Feedback",              "_boardsfeedback");

  /////////////////////////
  // Feature: Fish Chips //
  /////////////////////////
  PanelCreateTab(tabgroup, "Fish Chips", function(contentview)
  {
    $("#tab[tab='core-mods-fish-chips']").click(function()
    {
      LoadWebPanel("fishchips", contentview, function()
      {
        // Load web panel finished
      });
    });
  });

  // New Tabgroup: Social
  tabgroup = "Social";

  PanelCreateTab(tabgroup, "Friends", function(contentview)
  {
    $("#tab[tab='social-friends']").click(function()
    {
      LoadWebPanel("placeholder", contentview, function(){});
      // LoadWebPanel2("NO PAGE", "getFriends", contentview, function(){});
    });
  });

  PanelCreateTab(tabgroup, "Messages", function(contentview)
  {
    $("#tab[tab='social-messages']").click(function()
    {
      LoadWebPanel("placeholder", contentview, function(){});
      // LoadWebPanel2("NO PAGE", "messages", contentview, function(){});
    });
  });

  PanelCreateTab(tabgroup, "Send PM", function(contentview)
  {
    $("#tab[tab='social-send-pm']").click(function()
    {
      LoadWebPanel("placeholder", contentview, function(){});
      // LoadWebPanel2("NO PAGE", "writePM", contentview, function(){});
    });
  });

  // New Tabgroup: FEK
  tabgroup = "FEK";

  ///////////////////////////
  // Twitter Announcements //
  ///////////////////////////
  PanelCreateTab(tabgroup, "Announcements", function(contentview)
  {
    contentview.html("Loading Announcements...");

    // Prepare the twitter popup html
    var docbody = $("html").first().find("body:not(.wysiwyg)").first();
    docbody.append("<div id='twitter_row' class='popup'></div>");

    $(document).on("tweetsLoaded", function()
    {
      contentview.html("<h1>Announcements</h1>");
      if(FEKtweets.records && FEKtweets.records.length > 0)
      {
        for(var i = 0; i < FEKtweets.records.length; i++)
        {
          contentview.append('\
                             <div id="twitter_row">\
                             <div id="twitterlink">\
                             <a href="http://twitter.com/' + FEKtweets.records[i].user.screenName + '" target="_blank"><img src="' + FEKgfx + 'twittericon.png" /></a>\
                             </div>\
                             <h2>' + ParseTwitterDate(FEKtweets.records[i].created_at) + '</h2>\
                             <img id="twitter_img" src="' + FEKtweets.records[i].user.profile_image_url + '" />\
                             <span id="twitter_text">' + ReplaceUrlWithHtmlLink(FEKtweets.records[i].text.replace('#FEK ','')) + '</span>\
                             <span style="opacity:0; clear:both;">.</span>\
                             <div id="spike"></div>\
                             </div>\
                             ');
        }

        //Compare last read announcement to current one
        if(GM_getValue("_lastReadTwitter", "") == FEKtweets.records[0].id)
        {
          // The latest announcement has been read
        }
        else
        {
          // The latest announcement has NOT been read yet
          // Append alert icons for unread announcements
          alertHTML = '<span id="fekalert" style="position:relative; top:-2px; padding:3px; padding-left:2px; padding-right:2px; font:8px bold Arial, Helvetica, \'Sans Serif\'; border:1px solid #ff8800; margin-left:5px; background:#222222; border-radius:8px; color:#ffffff; text-shadow: 1px 1px rgba(0,0,0,.8);">NEW</span>';
          $("a[href='#fekpanel']").eq(0).append(alertHTML);
          $("a[href='#fekpanel']").eq(1).append(alertHTML);
          $("#fekpanel #tab[tab='misc-announcements']").append(alertHTML);
          $('body #twitter_row.popup').html('\
                                            <div id="twitterlink">\
                                            <a href="http://twitter.com/Tundra_Fizz" target="_blank"><img src="' + FEKgfx + 'twittericon.png" /></a>\
                                            </div>\
                                            <h2>' + ParseTwitterDate(FEKtweets.records[0].created_at) + '</h2>\
                                            <img id="twitter_img" src="' + FEKtweets.records[0].user.profile_image_url + '" />\
                                            <span id="twitter_text">' + ReplaceUrlWithHtmlLink(FEKtweets.records[0].text.replace('#FEK ','')) + '</span>\
                                            <div id="dismiss">Click here to dismiss the notification</div>\
                                            <span style="opacity:0; clear:both;">.</span>\
                                            <div id="spike"></div>\
                                            ');

          $("body #twitter_row.popup").fadeIn();
        }
      }

      // Now we need to have it mark announcements as read when dismissed or announcement tab is clicked
      $("#dismiss").click(function(event)
      {
        if(FEKtweets.records[0])
        {
          GM_setValue("_lastReadTwitter", FEKtweets.records[0].id);
        }

        $("body #twitter_row.popup").fadeOut();
        $("body #fekalert").each(function()
        {
          $(this).fadeOut();
        });
      });

      $("#tab[tab*='-announcements']").click(function()
      {
        if(FEKtweets.records[0])
        {
          GM_setValue("_lastReadTwitter", FEKtweets.records[0].id);
        }

        $("body #twitter_row.popup").fadeOut();

        $("body #fekalert").each(function()
        {
          $(this).fadeOut();
        });
      });
    });
  });

  ///////////////
  // Changelog //
  ///////////////
  PanelCreateTab(tabgroup, "Changelog", function(contentview)
  {
    $("#tab[tab*='fek-changelog']").click(function()
    {
      LoadWebPanel("changelog", contentview, function()
      {
        // Load web panel finished
      });
    });
  });

  ////////////
  // Donate //
  ////////////
  PanelCreateTab(tabgroup, "Donate", function(contentview)
  {
    $("#tab[tab*='fek-donate']").click(function()
    {
      LoadWebPanel("donate", contentview, function()
      {
        // Load web panel finished
      });
    });
  });

  // Register the hotkey ~ to toggle the FEK panel on and off
  hotkeys["192"] = function(state, event)
  {
    if(state === "keyup" && !$("input").is(":focus") && !$("textarea").is(":focus"))
    {
      PanelToggle();
    }
  };
}

////////////////////////////////////////////////////////////
// CreateFeature: Used within the CreateFeatures function //
////////////////////////////////////////////////////////////
function CreateFeature(label, variablename, options, initvalue, tooltip, tabgroup, tab, category, callback)
{
  // Registers a feature with the gui to handle variable reading/writing and then runs the callback function
  // Get the saved value if it exists, otherwise load the initvalue
  var useInitValue = GM_getValue(variablename, initvalue);

  // Check if the provided saved value is in the options group, if not reset it to the default option
  if(options)
  {
    var validOption = false;
    for(index = 0; index < options.length; ++index)
    {
      // Split the option and associated value apart
      optionpair = options[index].split("|");

      if(optionpair[0] === useInitValue)
      {
        validOption = true;
      }
    }

    if(!validOption && useInitValue !== "off")
    {
      // The user selected option no longer exists
      useInitValue = initvalue;
    }
  }

  // Create the tab for the feature
  PanelCreateTab(tabgroup, tab, function(contentview)
  {
    // The tab has been created, and we can now create the button within the returned contentview
    var buttonhtml, tooltiphtml, optionpair, initclass, initstyle;
    var scategory = category.replace( /[^a-z0-9\s]/gi, "").replace(/[_\s]/g, "-").toLowerCase();

    // Check if the category exists
    if(contentview.find("#optiongroup[optiongroup='" + scategory + "']").length <= 0)
    {
      // Create the category
      contentview.append('<div id="optiongroup" optiongroup="' + scategory + '">\
                            <h1 class="breakhead">' + category + '</h1>\
                          </div>');
    }

    tooltiphtml = '<div id="fektooltip-data">\
                     <span id="ttlabel">' + label + '</span><br />\
                     <span id="loadtime"></span>\
                     <p>' + tooltip + '</p>\
                   </div>';

    if(variablename == "dummy")
    {
      contentview.find("#optiongroup[optiongroup='" + scategory + "']").append("<div id='button' style='visibility: hidden;'></div>");
    }
    // Create the button toggle for the feature, checking if options is supplied to make it a dropdown
    else if(options && typeof options ==="object")
    {
      // An array of options has been provided, so this is a dropdown
      var initlabel, listhtml = '';
      optionpair = '';

      // Prepare the list html
      for(index = 0; index < options.length; ++index)
      {
        // Split the option and associated value apart
        optionpair = options[index].split('|');
        listhtml = listhtml + '<li fekvalue="' + optionpair[0] + '">' + optionpair[1] + '</li>';
        if(optionpair[0] === useInitValue)
        {
          initlabel = optionpair[1];
        }
      }

      // Prepare the button html
      if(useInitValue === "off")
      {
        initclass = 'inactive ';
        initstyle = 'background-position:center; background-repeat:no-repeat; background-image:url(\'' + FEKgfx + 'button-off.png\');';
        initlabel = 'Disable';
      }
      else
      {
        initclass = '';
        initstyle = 'background-position:center; background-repeat:no-repeat; background-image:url(\'' + FEKgfx + 'button-on.png\');';
      }

      buttonhtml = '<div id="button" class="' + initclass + 'dropdown" fekvar="' + variablename + '" style="background-position:right 10px; background-repeat:no-repeat; background-image:url(\'' + FEKgfx + 'drop-indicator.png\');">\
                     ' + tooltiphtml + '\
                     <div id="indicator" style="' + initstyle + '"></div>\
                     <span id="label">' + label + '</span>\
                     <span id="choice" fekvalue="' + useInitValue + '">' + initlabel + '</span>\
                     <ul>\
                       ' + listhtml + '\
                     </ul>\
                   </div>';

      contentview.find("#optiongroup[optiongroup='" + scategory + "']").append(buttonhtml);
    }
    else
    {
      // No options provided, so this is a toggle
      if(useInitValue === 'off')
      {
        initclass = 'inactive';
        initstyle = 'background-position:center; background-repeat:no-repeat; background-image:url(\'' + FEKgfx + 'button-off.png\');';
      }
      else
      {
        initclass = '';
        initstyle = 'background-position:center; background-repeat:no-repeat; background-image:url(\'' + FEKgfx + 'button-on.png\');';
      }

      buttonhtml = '<div id="button" class="' + initclass + '" fekvar="' + variablename + '">\
                     ' + tooltiphtml + '\
                     <div id="indicator" style="' + initstyle + '"></div>\
                     <span id="label">' + label + '</span>\
                   </div>';

      contentview.find("#optiongroup[optiongroup='" + scategory + "']").append(buttonhtml);
    }
  });

  // Run the feature via callback if the feature isn't disabled
  if(useInitValue !== "off")
  {
    if(recordOverhead == "on")
    {
      // Setup the performance timer for the current option
      if(!overheadTimers)
      {
        overheadTimers = [];
      }

      overheadTimers[variablename] = [];

      // Create the starting time
      overheadTimers[variablename].start = new Date().getTime();

      // Run the callback
      callback(useInitValue);

      // Calculate the processing time
      overheadTimers[variablename].end = new Date().getTime();
      overheadTimers[variablename].time = overheadTimers[variablename].end - overheadTimers[variablename].start;

      if(overheadTimers[variablename].time === 0)
      {
        overheadTimers[variablename].time = '< 1';
      }

      $("#fekpanel #button[fekvar='" + variablename + "'] #loadtime").html("Overhead: " + overheadTimers[variablename].time + "ms");
    }
    else
    {
      callback(useInitValue);
    }
  }
}

//////////////////////////////////////////////////
// CreateGUI: Creates the GUI for the FEK panel //
//////////////////////////////////////////////////
function CreateGUI()
{
  var tooltipshtml = '<div id="fektooltip">tooltip test</div>';

  var panelhtml = '<div id="fekpanel">\
                     <div id="col1">\
                       <div id="logo" style="background:url(' + FEKgfx + 'logo.png) no-repeat"></div>\
                       <div id="version">v' + FEKversion + '</div>\
                       <div id="tabs"></div>\
                     </div>\
                     <div id="col2">\
                       <div id="refreshNotice">\
                         Changes Saved. Click Here To Refresh The Page.\
                       </div>\
                       <div id="fekScrollRegion" class="fekScrollRegion"></div>\
                     </div>\
                   </div>';

  var docbody = $("html").first().find("body:not(.wysiwyg)").first();
  docbody.append(panelhtml);
  docbody.append(tooltipshtml);

  // Hide FEK Panel so the user doesn't see a whole bunch
  // of random text for the second while the webpage loads
  $("#fekpanel").hide();
}

/////////////////////////////////////////////////////////////////////////////////
// SettleGUI: Sets the FEK panel to a default tab so that it doesn't look ugly //
/////////////////////////////////////////////////////////////////////////////////
function SettleGUI()
{
  // This sets the GUI panel to the first tab
  $("#fekpanel #tab").each(function()
  {
    // Remove all contentviews and active tabs
    $(this).removeClass("active");
    $("#fekpanel #col2 #contentview").hide();
  });

  // Now set our active tab and contentview to the first tab listed
  $("#fekpanel #tab:first").addClass("active");
  $("#fekpanel #col2 #contentview[tablink='" + $('#fekpanel #tab:first').attr('tab') + "']").show();
}

////////////////////////////////////////////////////////////////
// PanelCreateTab: Creates a new tab on the FEK control panel //
////////////////////////////////////////////////////////////////
function PanelCreateTab(tabgroup, tab, callback)
{
  // This will create a tab and content view with the supplied paramaters and send the contentview element back to the calling function
  // Prepare special compatible/safe tag names by replacing characters and casing
  var stabgroup = tabgroup.replace( /[^a-z0-9\s]/gi, "").replace(/[_\s]/g, "-").toLowerCase();
  var stab      = tab.replace( /[^a-z0-9\s]/gi, "").replace(/[_\s]/g, "-").toLowerCase();

  // Check if the tabgroup exists
  if($("#fekpanel #col1 #tabgroup[tabgroup='" + stabgroup + "']").length <= 0)
  {
    // Create the tabgroup
    $('#fekpanel #col1 #tabs').append('<div id="tabgroup" tabgroup="' + stabgroup + '">\
                                         <h1>' + tabgroup + '</h1>\
                                       </div>');
  }

  // Check if the tab exists
  if($("#tab[tab='" + stabgroup + "-" + stab + "']").length <= 0)
  {
    // Create the tab
    $("#tabgroup[tabgroup='" + stabgroup + "']").append('<div id="tab" tab="' + stabgroup + "-" + stab + '">' + tab + '<div id="indicator"></div></div>');
  }

  // Check if the contentview exists
  if($("#fekpanel #col2 .fekScrollRegion #contentview[tablink='" + stabgroup + "-" + stab + "']").length <= 0)
  {
    // Create the contentview
    $("#fekpanel #col2 .fekScrollRegion").append('<div id="contentview" tablink="' + stabgroup + '-' + stab + '"></div>');
  }

  // Now that we've setup the tab and contentview panel, lets send the contentview through the callback
  callback($("#contentview[tablink='" + stabgroup + "-" + stab + "']"));
}

////////////////////////////////////////////
// PanelShow: Shows the FEK control panel //
////////////////////////////////////////////
function PanelShow()
{
  if($("#fekpanel").is(":visible"))
  {
    // If the panel is already visible when show is called, do nothing
  }
  else
  {
    // Hide all content views to speed up the .show animation
    $("#fekScrollRegion").hide();

    // Show the panels off-screen so that we can perform pre-animation calculations
    $( "#fekpanel #col1" ).css("left", "-200vw");
    $( "#fekpanel #col2" ).css("left", "-200vw");

    $("#fekpanel").show(); $("#fekpanel #col2").show();

    // Get current panel widths
    var col1width = $("#fekpanel #col1").outerWidth();
    var col2width = $("#fekpanel #col2").outerWidth();

    // Set start points
    $( "#fekpanel #col1" ).css("left", "-" + col1width + "px");
    $( "#fekpanel #col2" ).css("left", "-" + col2width + "px");

    // Animate
    $( "#fekpanel #col1" ).stop().animate({left: "0px"}, 200, function()
    {
      $("#fekpanel #col2").css("left","-" + (col2width - col1width) + "px");
      $( "#fekpanel #col2" ).stop().animate({left: col1width + "px"}, 150, function()
      {
        // Hide all content views to speed up the .show animation
        $("#fekScrollRegion").show();
        InitScrollbar(".fekScrollRegion");
      });
    });
  }
}

////////////////////////////////////////////
// PanelHide: Hides the FEK control panel //
////////////////////////////////////////////
function PanelHide()
{
  // Get current panel widths
  var col1width = $("#fekpanel #col1").outerWidth();
  var col2width = $("#fekpanel #col2").outerWidth();

  // Hide all content views to speed up the .show animation
  $("#fekScrollRegion").hide();

  // Animate
  $("#fekpanel #button").find("ul").hide();
  $( "#fekpanel #col2" ).stop().animate({left: "-" + (col2width - col1width) + "px"}, 150, function()
  {
    $("#fekpanel #col2").hide();
    $( "#fekpanel #col1" ).stop().animate({left: "-" + (col1width) + "px"}, 200, function()
    {
      $("#fekpanel").hide();
    });
  });
}

////////////////////////////////////////////////
// PanelToggle: Toggles the FEK control panel //
////////////////////////////////////////////////
function PanelToggle()
{
  if($("#fekpanel").is(":visible"))
  {
    PanelHide();
  }
  else
  {
    PanelShow();
  }
}

/////////////////////////////////////////////////////////////////////////////////
// LoadWebPanel: Loads web panels such as Credits, Announcements, Events, etc. //
/////////////////////////////////////////////////////////////////////////////////
function LoadWebPanel(page, container, callback)
{
  container.html("Loading...");
  var webPanel = $.ajax(
  {
    dataType: "json",
    url: FEKendpoint,
    data:
    {
      action: "getWebPanel",
      page:   page
    }
  }).success(function(data)
  {
    container.html(data.html);
    InitScrollbar(".fekScrollRegion");
    callback();
  });
}

///////////////////////////////////////
// LoadWebPanel2: Experimental stuff //
///////////////////////////////////////
function LoadWebPanel2(page, action, container, callback)
{
  container.html("Loading...");
  var webPanel = $.ajax(
  {
    dataType: "json",
    url: FEKendpoint,
    data:
    {
      action:   action,
      page:     page,
      myName:   myName,
      myRegion: myRegion
    }
  }).success(function(data)
  {
    container.html(data.html);
    InitScrollbar(".fekScrollRegion");
    callback();
  });
}

///////////////////////////////////////////////
// InitScrollbar: Initializes the scroll bar //
///////////////////////////////////////////////
function InitScrollbar(element)
{
  var elm;
  var supressx = false;
  var supressy = false;

  // Turn the provided element into an object, whether it was a selector or dom object passed
  elm = $(element);

  // Check for overflow values
  if(!elm.hasOverflowX()) {supressx = true;}
  if(!elm.hasOverflowY()) {supressy = true;}

  // Setup the css
  elm.css("overflow", "hidden");

  // Check if scrollbar exists already. if it does, update it's values
  if(elm.hasClass("ps-container"))
  {
    // Update the scrollbar
    elm.perfectScrollbar("destroy");
    elm.perfectScrollbar({wheelSpeed: 30, useKeyboard: true, minScrollbarLength: 35, suppressScrollY: supressy, suppressScrollX: supressx});
  }
  else
  {
    // Create the scrollbar
    elm.perfectScrollbar({wheelSpeed: 30, useKeyboard: true, minScrollbarLength: 35, suppressScrollY: supressy, suppressScrollX: supressx});

    // Register our element's scrollbars to update on resize
    $(window).resize(function()
    {
      elm.perfectScrollbar("update");
    });
  }

  // Destroy the scrollbar if it isn't needed and remove the class we reference
  if(!elm.hasOverflow())
  {
    elm.perfectScrollbar("destroy");
    elm.removeClass("ps-container");
  }
}

/////////////////////////////////////////
// Extend jQuery for FEK control panel //
/////////////////////////////////////////
$.fn.hasOverflow = function()
{
  var leeway = 0;
  var element = $(this)[0];
  if(element.clientWidth < (element.scrollWidth - leeway) || element.clientHeight < (element.scrollHeight - leeway))
  {
    return true;
  }

  return false;
};

$.fn.hasOverflowX = function()
{
  var leeway = 0;
  var element = $(this)[0];
  if(element.offsetWidth < (element.scrollWidth - leeway))
  {
    $(this).attr("overflowX", (element.scrollWidth - leeway) - element.offsetWidth);
    return true;
  }
  else
  {
    $(this).attr("overflowX", "0");
    return false;
  }
};

$.fn.hasOverflowY = function()
{
  var leeway = 0;
  var element = $(this)[0];
  if(element.offsetHeight < (element.scrollHeight - leeway))
  {
    $(this).attr("overflowY", (element.scrollHeight - leeway) - element.offsetHeight);
    return true;
  }
  else
  {
    $(this).attr("overflowY", "0");
    return false;
  }
};

/////////////////////////////////////
// ========== UTILITIES ========== //
/////////////////////////////////////

//////////////////////////////////////
// KeyWatch: Watches for keypresses //
//////////////////////////////////////
function KeyWatch()
{
  // Clear the active keys when the window is focused or when the text area is refocused
  $(window).focus(function()
  {
    activeKeys = [];
  });

  // Watch for key modifiers being held down
  $(document).keydown(function(event)
  {
    var i = activeKeys.indexOf(event.which);
    if(i == -1)
    {
      activeKeys.push(event.which);
    }
    if(hotkeys[event.which] && typeof hotkeys[event.which] === "function")
    {
      hotkeys[event.which]("keydown", event);
    }
  });

  // Watch for key modifiers being released
  $(document).keyup(function(event)
  {
    if(hotkeys[event.which] && typeof hotkeys[event.which] === "function")
    {
      hotkeys[event.which]("keyup", event);
    }

    var i = activeKeys.indexOf(event.which);
    if(i != -1)
    {
      activeKeys.splice(i, 1);
    }
  });

  // Setup the fek tooltip
  $(document).on("mousemove", function(e)
  {
    if($("#fektooltip").css("opacity") > 0)
    {
      $("#fektooltip").css(
      {
        left:  e.pageX + 20,
        top:   e.pageY - 20
      });
    }
    else
    {
      $("#fektooltip").css(
      {
        left:  -10000
      });
    }
  });

  $("#fekpanel #button").mouseenter(function()
  {
    $("#fektooltip").html($(this).find("#fektooltip-data").html());
    $("#fektooltip").css("opacity", 1);
  });

  $("#fekpanel #button").mouseleave(function()
  {
    $("#fektooltip").html($(this).find("#fektooltip-data").html());
    $("#fektooltip").css("opacity", 0);
  });

  // Allow clicking away from the panel to close the panel
  $("body").click(function()
  {
    PanelHide();
  });

  $("#fekpanel").click(function(event)
  {
    event.stopPropagation();
    $("#fekpanel #button").find("ul").hide();
  });

  // Register click events and activates the feklink tabs
  $("body").on("click", "a[href*='#fektab']", function(event)
  {
    event.stopPropagation();
    event.preventDefault();
    var tab = $(this).attr("href").replace("#fektab-","");
    $("#tab[tab='" + tab + "']").trigger("click");
    PanelShow();
  });

  $("a[href='#fekpanel']").click(function(event)
  {
    event.stopPropagation();
    event.preventDefault();
    PanelToggle();
  });

  $("#fekpanel #tab").click(function()
  {
    $("#fekpanel #tab").each(function()
    {
      // Remove all contentviews and active tabs
      $(this).removeClass("active");
      $("#fekpanel #col2 #contentview").hide();
    });

    $(this).addClass("active");
    $("#fekpanel #col2 .fekScrollRegion").scrollTop(0);
    $("#fekpanel #col2 #contentview[tablink=" +$(this).attr("tab") + "]").show();
    InitScrollbar(".fekScrollRegion");
  });

  $("#fekpanel").on("mousewheel", function(event)
  {
    event.preventDefault();
  });

  $("#fekpanel #button").find("ul").on("mousewheel", function(event)
  {
    event.stopPropagation();
    event.preventDefault();
  });

  $("#fekpanel #button").click(function(event)
  {
    event.stopPropagation();
    if($(this).hasClass("dropdown"))
    {
      if($(this).find("ul").is(":visible"))
      {
        $(this).find("ul").hide();
      }
      else
      {
        $("#fekpanel #button").find("ul").hide();
        $("#fekpanel #button").css("z-index", "9998");
        $(this).find("ul").show();
        $(this).css("z-index", "9999");
        $(this).find("ul").scrollTop(0);
        InitScrollbar($(this).find("ul"));
      }
    }
    else
    {
      $("#fekpanel #button").find("ul").hide();
      $("#refreshNotice").addClass("visible");

      var variablename = $(this).attr("fekvar");

      if($(this).hasClass("inactive"))
      {
        // Turn the variable on and save state
        GM_setValue(variablename, "on");
        $(this).removeClass("inactive");
        $(this).find("#indicator").attr("style", "background-position:center; background-repeat:no-repeat; background-image:url(\"" + FEKgfx + "button-on.png\");");
      }
      else
      {
        // Turn the variable and save state
        GM_setValue(variablename, "off");
        $(this).addClass("inactive");
        $(this).find("#indicator").attr("style", "background-position:center; background-repeat:no-repeat; background-image:url(\"" + FEKgfx + "button-off.png\");");
      }
    }
  });

  $("#fekpanel #button ul li").click(function()
  {
    var previousChoice = $(this).closest("#button").find("#choice").text();
    if($(this).text() !== previousChoice)
    {
      var variablename = $(this).parent().parent().attr("fekvar");
      GM_setValue(variablename, $(this).attr("fekvalue"));
      $("#refreshNotice").addClass("visible");
    }

    $(this).closest("#button").find("#choice").html($(this).html());
    $(this).closest("#button").find("#choice").attr("fekvalue", $(this).attr("fekvalue"));

    if($(this).attr("fekvalue") === "off")
    {
      if($(this).closest("#button").hasClass("inactive"))
      {
        // Nothing
      }
      else
      {
        $(this).closest("#button").addClass("inactive");
        $(this).closest("#button").find("#indicator").attr("style", "background-position:center; background-repeat:no-repeat; background-image:url(\"" + FEKgfx + "button-off.png\");");
      }
    }
    else
    {
      $(this).closest("#button").removeClass("inactive");
      $(this).closest("#button").find("#indicator").attr("style", "background-position:center; background-repeat:no-repeat; background-image:url(\"" + FEKgfx + "button-on.png\");");
    }
  });

  $("#refreshNotice").click(function()
  {
    location.reload();
  });
}

///////////////////////////////////////////////////
// ChangeElementType: Changes the element's type //
///////////////////////////////////////////////////
(function($) {$.fn.ChangeElementType = function(newType) {var attrs = {}; $.each(this[0].attributes, function(idx, attr) {attrs[attr.nodeName] = attr.nodeValue;}); this.replaceWith(function() {return $("<" + newType + "/>", attrs).append($(this).contents());});};})(jQuery);

//////////////////////////////////////////////////
// GradientText: Gives a color gradient to text //
//////////////////////////////////////////////////
(function(e){e("head").append('<style type="text/css">.sn-pxg .pxg-set{user-select:none;-moz-user-select:none;-webkit-user-select:none;}.sn-pxg span.pxg-source{position:relative;display:inline-block;z-index:2;}.sn-pxg U.pxg-set,.sn-pxg U.pxg-set S,.sn-pxg U.pxg-set S B{left:0;right:0;top:0;bottom:0;height:inherit;width:inherit;position:absolute;display:inline-block;text-decoration:none;font-weight:inherit;}.sn-pxg U.pxg-set S{overflow:hidden;}.sn-pxg U.pxg-set{text-decoration:none;z-index:1;display:inline-block;position:relative;}</style>');e.fn.GradientText=function(t){function r(e){if("#"==e.substr(0,1)){e=e.substr(1)}if(3==e.length){e=e.substr(0,1)+e.substr(0,1)+e.substr(1,1)+e.substr(1,1)+e.substr(2,1)+e.substr(2,1)}return[parseInt(e.substr(0,2),16),parseInt(e.substr(2,2),16),parseInt(e.substr(4,2),16)]}function i(e){var t="0123456789abcdef";return"#"+t.charAt(parseInt(e[0]/16))+t.charAt(e[0]%16)+t.charAt(parseInt(e[1]/16))+t.charAt(e[1]%16)+t.charAt(parseInt(e[2]/16))+t.charAt(e[2]%16)}function s(e,n){var r=e>0?e/n:0;for(var i=0;i<t.colors.length;i++){fStopPosition=i/(t.colors.length-1);fLastPosition=i>0?(i-1)/(t.colors.length-1):0;if(r==fStopPosition){return t.colors[i]}else if(r<fStopPosition){fCurrentStop=(r-fLastPosition)/(fStopPosition-fLastPosition);return o(t.RGBcolors[i-1],t.RGBcolors[i],fCurrentStop)}}return t.colors[t.colors.length-1]}function o(e,t,n){var r=[];for(var s=0;s<3;s++){r[s]=e[s]+Math.round((t[s]-e[s])*n)}return i(r)}var t=e.extend({step:10,colors:["#ffcc00","#cc0000","#000000"],dir:"y"},t);t.RGBcolors=[];for(var n=0;n<t.colors.length;n++){t.RGBcolors[n]=r(t.colors[n])}return this.each(function(n,r){var i=e(r);if(!i.hasClass("sn-pxg")){var o=i.html();i.html('<span class="pxg-source" style="visibility: hidden;">'+o+"</span>").append('<u class="pxg-set"></u>');var u=i.find(".pxg-set");var a=i.find(".pxg-source");var f=a.innerWidth();var l=a.innerHeight();a.hide();i.addClass("sn-pxg");if(t.dir=="x"){var c=f}else if(t.dir=="y"){var c=l}var h=Math.floor(c/t.step);var p=h;var d=c-h*t.step;if(d>0){p++}u.css({width:f,height:l});var v=0;var m="";if(t.dir=="x"){for(var n=0;n<p;n++){var g=s(v,c);m+='<s style="height:'+l+"px;width:"+t.step+"px;left:"+v+"px;color:"+g+'"><b style="left:-'+v+"px;width:"+f+"px;height:"+l+'px;">'+o+"</b></s>";v=v+t.step}}else if(t.dir=="y"){for(var n=0;n<p;n++){var g=s(v,c);m+='<s style="width:'+f+"px;height:"+t.step+"px;top:"+v+"px;color:"+g+'"><b style="top:-'+v+"px;height:"+f+"px;height:"+l+'px;">'+o+"</b></s>";v=v+t.step}}u.append(m)}})}})(jQuery);

///////////////////////////////////////////////////////////////////
// CreateAlertBox: Creates an alert box at the top of the window //
///////////////////////////////////////////////////////////////////
function CreateAlertBox(top, background, border, color, innerHTML)
{
  var apolloHeader = document.getElementsByClassName("apollo-header")[0];
  var alertBanner = document.createElement("div");
  apolloHeader.appendChild(alertBanner);

  alertBanner.style.setProperty("position",              "absolute");
  alertBanner.style.setProperty("top",                   top);
  alertBanner.style.setProperty("left",                  "50%");
  alertBanner.style.setProperty("width",                 "600px");
  alertBanner.style.setProperty("margin-left",           "-300px");
  alertBanner.style.setProperty("padding",               "10px");
  alertBanner.style.setProperty("background",            background);
  alertBanner.style.setProperty("border",                "2px solid " + border);
  alertBanner.style.setProperty("color",                 color);
  alertBanner.style.setProperty("-webkit-border-radius", "4px");
  alertBanner.style.setProperty("-moz-border-radius",    "4px");
  alertBanner.style.setProperty("border-radius",         "4px");
  alertBanner.style.setProperty("-webkit-box-shadow",    "0px 0px 5px rgba(0, 0, 0, 0.9)");
  alertBanner.style.setProperty("-moz-box-shadow",       "0px 0px 5px rgba(0, 0, 0, 0.9)");
  alertBanner.style.setProperty("box-shadow",            "0px 0px 5px rgba(0, 0, 0, 0.9)");
  alertBanner.style.setProperty("text-shadow",           "1px 1px rgba(0,0,0,.8)");

  alertBanner.innerHTML = innerHTML;
  alertPopUp = true;
}

///////////////////////////////////////////////
// ParseTwitterDate: Parses the Twitter date //
///////////////////////////////////////////////
function ParseTwitterDate(text)
{
  var newtext = text.replace(/(\+\S+) (.*)/, "$2 $1");
  var date = new Date(Date.parse(text)).toLocaleDateString();
  var time = new Date(Date.parse(text)).toLocaleTimeString();

  // Remove the seconds from the timestamp
  var i = time.lastIndexOf(":");
  time = time.slice(0, i) + time.slice(i+3, time.length);

  return date + " - " + time;
}

///////////////////////////////////////////////////////////////////////
// ReplaceUrlWithHtmlLink: Replaces URLs with HTML links for twitter //
///////////////////////////////////////////////////////////////////////
function ReplaceUrlWithHtmlLink(text)
{
  var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
  return text.replace(exp, "<a href='$1' target=\"_blank\">$1</a>");
}

////////////////////////////////////////////////////////////////////////////////////////////////
// WaitAndRun: Waits for a certain element on the page to load and then executes the callback //
////////////////////////////////////////////////////////////////////////////////////////////////
function WaitAndRun(selector, callback)
{
  var timeOut = 2000, currentTime = 0;

  var interval = setInterval(function()
  {
    currentTime = currentTime + 1;

    if(currentTime >= timeOut)
    {
      clearInterval(interval);
    }
    else
    {
      if($(selector).length > 0)
      {
        clearInterval(interval);
        callback();
      }
    }
  }, 1);
}

//////////////////////////////////////////////////////////////////////////////////////////
// WaitAndRunManual: Waits for a specified amount of time before executing the callback //
//////////////////////////////////////////////////////////////////////////////////////////
function WaitAndRunManual(time, callback)
{
  var timeOut = time, currentTime = 0;

  var interval = setInterval(function()
  {
    currentTime = currentTime + 1;

    if(currentTime >= timeOut)
    {
      clearInterval(interval);
      callback();
    }
  }, 1);
}

////////////////////////////////////////////////////////////////////////
// GetBadgesAndTitle: Gets a user's badges and title using Riot's API //
////////////////////////////////////////////////////////////////////////
function GetBadgesAndTitle(usernameT, regionT, profHover, donor, staff, title, badge)
{
  $.getJSON("http://boards." + platformRegion + ".leagueoflegends.com/api/users/" + regionT + "/" + usernameT + "?include_profile=true", function(api)
  {
    if(!profHover.getElementsByClassName("badge-container")[0] && !profHover.getElementsByClassName("title")[0])
    {
      var data;
      var badges = [];

      if(api.profile)
      {
        data = api.profile.data;

        if(typeof title == "undefined")
          title = data.title;
      }

      if(typeof data !== "undefined")
      {
        if(data.b_raf)     {badges.push("https://cdn.leagueoflegends.com/apollo/badges/raf.png");}
        if(data.b_s01gold) {badges.push("https://cdn.leagueoflegends.com/apollo/badges/s1gold.png");}
        if(data.b_s01plat) {badges.push("https://cdn.leagueoflegends.com/apollo/badges/s1platinum.png");}

        if(data.b_s02plat) {badges.push("https://cdn.leagueoflegends.com/apollo/badges/s2platinum.png");}
        if(data.b_s02diam) {badges.push("https://cdn.leagueoflegends.com/apollo/badges/s2diamond.png");}

        if(data.b_s03gold) {badges.push("https://cdn.leagueoflegends.com/apollo/badges/s3gold.png");}
        if(data.b_s03plat) {badges.push("https://cdn.leagueoflegends.com/apollo/badges/s3platinum.png");}
        if(data.b_s03diam) {badges.push("https://cdn.leagueoflegends.com/apollo/badges/s3diamond.png");}
        if(data.b_s03chal) {badges.push("https://cdn.leagueoflegends.com/apollo/badges/s3challenger.png");}

        if(data.b_s04gold) {badges.push("https://cdn.leagueoflegends.com/apollo/badges/s4gold.png");}
        if(data.b_s04plat) {badges.push("https://cdn.leagueoflegends.com/apollo/badges/s4platinum.png");}
        if(data.b_s04diam) {badges.push("https://cdn.leagueoflegends.com/apollo/badges/s4diamond.png");}
        if(data.b_s04mast) {badges.push("https://cdn.leagueoflegends.com/apollo/badges/s4master.png");}
        if(data.b_s04chal) {badges.push("https://cdn.leagueoflegends.com/apollo/badges/s4challenger.png");}

        if(data.b_s05gold) {badges.push("http://i.imgur.com/KqTvYEa.png");}
        if(data.b_s05plat) {badges.push("http://i.imgur.com/l9lMtwa.png");}
        if(data.b_s05diam) {badges.push("http://i.imgur.com/A073pTS.png");}
        if(data.b_s05mast) {badges.push("http://i.imgur.com/ur0LOXd.png");}
        if(data.b_s05chal) {badges.push("http://i.imgur.com/ZmmVMrB.png");}

        if(data.b_s06gold) {badges.push("https://cdn.leagueoflegends.com/apollo/badges/s6gold.png");}
        if(data.b_s06plat) {badges.push("https://cdn.leagueoflegends.com/apollo/badges/s6platinum.png");}
        if(data.b_s06diam) {badges.push("https://cdn.leagueoflegends.com/apollo/badges/s6diamond.png");}
        if(data.b_s06mast) {badges.push("https://cdn.leagueoflegends.com/apollo/badges/s6master.png");}
        if(data.b_s06chal) {badges.push("https://cdn.leagueoflegends.com/apollo/badges/s6challenger.png");}
      }

        if(staff == "1")                                     {badges.push(FEKgfx + "fekbadge.png");}
        if((badge !== "") && (typeof badge !== "undefined")) {badges.push(badge);}

        if(donor)
        {
          donor = donor.replace(/:| /g,"-");
          var YMDhms = donor.split("-");
          var donorDate = new Date();
          donorDate.setFullYear(parseInt(YMDhms[0]), parseInt(YMDhms[1])-1, parseInt(YMDhms[2]));
          donorDate.setHours(parseInt(YMDhms[3]), parseInt(YMDhms[4]), parseInt(YMDhms[5]), 0);

          if(currentDate < donorDate)
            {badges.push(FEKgfx + "donor.png");}
        }

        var badgeContainer;

        // badgeContainer size is 160, and badges are 36x36
        // 1-4 badges: 36x36
        //   5 badges: 32x32
        //   6 badges: 26x26
        //   7 badges: 22x22
        //   8 badges: 20x20
        var badgeSize; if     (badges.length <= 4) badgeSize = "36px";
                       else if(badges.length == 5) badgeSize = "32px";
                       else if(badges.length == 6) badgeSize = "26px";
                       else if(badges.length == 7) badgeSize = "22px";
                       else if(badges.length == 8) badgeSize = "20px";

        if(badges.length > 0)
        {
          badgeContainer = document.createElement("div");
          badgeContainer.className = "badge-container";
          badgeContainer.style.setProperty("position",   "relative", "important");
          badgeContainer.style.setProperty("top",        "-8px",     "important");
          badgeContainer.style.setProperty("width",      avatarSize + 60 + "px", "important");
          badgeContainer.style.setProperty("height",     "36px",     "important");
          badgeContainer.style.setProperty("text-align", "center",   "important");
          profHover.appendChild(badgeContainer);
        }

        while(badges.length > 0)
        {
          var badgeName = badges.shift();
          var divBadge = document.createElement("img");
          divBadge.className = "badge";
          divBadge.setAttribute("src", badgeName);

          divBadge.style.setProperty("width",  badgeSize, "important");
          divBadge.style.setProperty("height", badgeSize, "important");

          badgeContainer.appendChild(divBadge);
        }

      // Apply a title if you have one
      if(typeof title !== "undefined")
      {
        var divTitle = document.createElement("div");

        divTitle.className = "title";
        divTitle.textContent = title;
        divTitle.style.setProperty("position",       "relative",     "important");
        divTitle.style.setProperty("top",            "-8px",         "important");
        divTitle.style.setProperty("width",          avatarSize + 60 + "px", "important");
        divTitle.style.setProperty("max-width",      avatarSize + 60 + "px", "important");
        divTitle.style.setProperty("max-height",     "52px",         "important");
        divTitle.style.setProperty("text-align",     "center",       "important");
        divTitle.style.setProperty("overflow",       "hidden",       "important");
        divTitle.style.setProperty("letter-spacing", "0px",          "important");
        divTitle.style.setProperty("display",        "inline-block", "important");
        divTitle.style.setProperty("font-size",      "36px",         "important"); // Artificially inflate size of textbox here
        divTitle.style.setProperty("font-variant",   "normal",       "important");
        divTitle.style.setProperty("font-family",    "'Constantia', 'Palatino', 'Georgia', serif",   "important");

        profHover.appendChild(divTitle);

        if(title.length < 24)
          divTitle.style.setProperty("font-size", "14px", "important");
        else if(title.length < 28)
          divTitle.style.setProperty("font-size", "12px", "important");
        else
          divTitle.style.setProperty("font-size", "10px", "important");

        if(staff == "1")
        {
          divTitle.style.setProperty("font-size", "26px", "important");

          $(divTitle).GradientText(
          {
            step: 10,
            colors: ["#68BAFF", "#008AFF", "#68BAFF"],
            dir: "x"
          });

          if(title.length >= 16)
            divTitle.style.setProperty("font-size", "13px", "important");
          else
            divTitle.style.setProperty("font-size", "14px", "important");
        }
      }
    }
  });
}

////////////////////////////////////////
// ========== FEK FEATURES ========== //
////////////////////////////////////////

///////////////////////////////////////////////////////////
// EmbedMedia: Replaces all webm links with actual webms //
///////////////////////////////////////////////////////////
function EmbedMedia()
{
  var links = document.links;
  for(var i = 0; i < links.length; ++i)
  {
    if(links[i].href.slice(-5) == ".webm")
    {
      var obj = document.getElementsByTagName("a");

      for(var j = 0; j < obj.length; ++j)
      {
        if(links[i].href === obj[j].href)
        {
          obj[j].innerHTML = "";                         // Remove the url since it's not needed
          var webm = document.createElement("video");    // Create the webm element
          webm.setAttribute("width", "500");             // Define the width
          webm.setAttribute("controls", "");             // Create the controls
          var source = document.createElement("source"); // Create the source element
          source.setAttribute("src", links[i].href);     // Set the source
          webm.appendChild(source);                      // Attach the source onto the webm
          obj[j].insertBefore(webm, obj[j].children[0]); // Insert the final result into the post

          // It is imperative to change the .webm's parent from an <a> to a <div>
          $(obj[j]).ChangeElementType("div");
          //obj[j].href = "#";

          // We are done with this loop now
          j = obj.length;
        }
      }
    }
  }

  // YouTube videos do not load immediately, so I have to wait a little bit
  WaitAndRunManual(500, EmbedYouTube);
}

function EmbedYouTube()
{
  // Get all of the YouTube objects
  var youtubeObj = document.getElementsByClassName("video-thumb-link");
  var youtubeObjLength = youtubeObj.length;

  for(i = 0; i < youtubeObjLength; i++)
  {
    var regex = /ytimg.com%2Fvi%2F(.*?)%2F/g;

    // Extract the Youtube's video Id
    var youtubeId = regex.exec(youtubeObj[0].innerHTML)[1];

    // Create the new embedded YouTube video in the object's parent
    $($(youtubeObj[0]).parent()).append('<iframe width="533" height="300" src="https://www.youtube.com/embed/' + youtubeId + '" frameborder="0" allowfullscreen></iframe>');

    // Remove the old object since it's useless
    $(youtubeObj[0]).remove();
  }
}

/////////////////////////////////////////////////////////////
// ColorVotes: Colors upvotes green and downvotes negative //
/////////////////////////////////////////////////////////////
function ColorVotes()
{
  var totalVotes = $(document).find(".total-votes");

  $(totalVotes).each(function()
  {
    if($(this).html()[0] == "-")
    {
      // Make red for downvotes
      this.style.setProperty( "color", "#FF5C5C", "important");
    }
    else if($(this).html()[0] == "•")
    {
      // Do nothing
    }
    else if($(this).html() != "0" && $(this).html() != "1")
    {
      // Make green for upvotes
      this.style.setProperty( "color", "#05E100", "important");
    }
  });
}

//////////////////////////////////////////////////////////////////////////////////////////////
// HoverVotes: Attaches a hover event to the vote numbers to display their individual votes //
//////////////////////////////////////////////////////////////////////////////////////////////
function HoverVotes()
{
  if(votingDisplay != "off")
  {
    var voteBox = ".riot-voting";

    $(voteBox).each(function()
    {
      if(votingDisplay == "hide")
      {
        this.style.setProperty("visibility", "hidden", "important");
      }
      else
      {
        if(this.hasAttribute("hover-event") === false)
        {
          this.setAttribute("hover-event", "true");
          $(this).hover(function()
          {
            ShowIndividualVotes(this, page);
          }, function()
          {
            $("#up-down-display").remove();
            $(".total-votes").show();
          });
        }
      }
    });
  }
}

//////////////////////////////////////////////////////////////////////////////////////////
// ShowIndividualVotes: Shows how many upvotes and downvotes a specific thread/post has //
//////////////////////////////////////////////////////////////////////////////////////////
function ShowIndividualVotes(obj, page)
{
  var voteFinder    = obj.parentElement;
  var uVotes        = voteFinder.getAttribute("data-apollo-up-votes");
  var dVotes        = voteFinder.getAttribute("data-apollo-down-votes");
  var voteScore     = obj.getElementsByClassName("total-votes")[0];

  var upDownDisplay = document.createElement("li");
  $(upDownDisplay).attr("id", "up-down-display");

  if($(obj).closest(".op-container").length)
  {
    // CSS for op's vote
    $(upDownDisplay).css("padding", "4px 0px 4px");
    $(upDownDisplay).css("font-size", "12px");
  }
  else
  {
    // CSS for non-op's vote
    $(upDownDisplay).css("padding", "4px 0px 2px");
  }

  obj.insertBefore(upDownDisplay, obj.children[1]);

  if(votingDisplay == "individual")
  {
    upDownDisplay.innerHTML = "<font color='#05E100'>" +   uVotes + "</font>"  + " <font color='white'>|</font> " + "<font color='#FF5C5C'>" + dVotes + "</font>";
  }
  else if(votingDisplay == "total")
  {
    upDownDisplay.innerHTML = "<font color='#FFA500'>" + (+uVotes + (+dVotes)) + "</font>";
  }

  $(voteScore).hide();
}

////////////////////////////////////////////////////////////////////////////////////
// RemoveThumbnailBackground: Removes the background from thumbnails on the index //
////////////////////////////////////////////////////////////////////////////////////
function RemoveThumbnailBackground()
{
  // Remove the background image from every thumbnail
  $(".thumbnail-fallback").each(function()
  {
    this.style.setProperty("background-image", "none", "important");
  });

  // animateThumbnails option
  if(animateThumbnails == "animate")
  {
    $(document.getElementsByTagName("img")).each(function()
    {
      var thumbnail = this.getAttribute("src");

      if(thumbnail.slice(-14) == "&animate=false")
      {
        this.setAttribute("src", thumbnail.slice(0, thumbnail.length - 14) + "&animate=true");
      }
    });
  }
  else if(animateThumbnails == "hide")
  {
    $(".discussion-list-item td.thumbnail").css("max-width", "0px");
    $(document.getElementsByClassName("thumbnail-fallback")).each(function()
    {
      $(this).remove();
    });
  }
}

///////////////////////////////////////////////////////////////////////
// HighlightMyThreads: Highlights your threads as black on the index //
///////////////////////////////////////////////////////////////////////
function HighlightMyThreads()
{
  if(page == "Index")
  {
    $(".discussion-list-item").each(function()
    {
      // We need to avoid any threads that don't have a name to them
      if(this.getElementsByClassName("username")[0])
      {
        var name = this.getElementsByClassName("username")[0].textContent;

        if(name == myName)
        {
          this.style.setProperty("background-color", highlightMyThreads, "important");
        }
      }
    });
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// EnhancedThreadPreview: Displays a fancier preview when you hover the mouse over a thread on the index //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function EnhancedThreadPreview()
{
  if(page == "Index")
  {
    $(".title-span").each(function()
    {
      if($(this).attr("title"))
      {
        $(this).attr("ttdata", $(this).attr("title"));

        $(this).parent().parent().parent().mouseenter(function()
        {
          $("#fektooltip").html("<div id='ttlabel'>"  + $(this).find(".username").text()   + "</div>\
                                 <div id='loadtime'>" + $(this).find(".title-span").text() + "</div>\
                                 <p>" + $(this).find(".title-span").attr("ttdata").replace(/[\n\r]/g, "<br />").replace(/{{champion:??:.*?}}/g, MiniChampionIcons).replace(/{{item:??:.*?}}/g, MiniItemIcons).replace(/{{summoner:??:.*?}}/g, MiniSummonerIcons) + "</p>");

          $("#fektooltip").css({"opacity" : "1"});
        });

        $(this).parent().parent().parent().mouseleave(function() {$("#fektooltip").css({"opacity":"0"});});
        this.removeAttribute("title");
      }
    });
  }
}

//////////////////////////////////////////////////////////////////////
// MiniChampionIcons: Displays champion icons in the thread preview //
//////////////////////////////////////////////////////////////////////
function MiniChampionIcons(x)
{
  var start = x.indexOf(':') + 1;
  var end   = x.indexOf('}', start);
  var icon  = "c" + x.substring(start, end);
  return "<img src='" + cIcons + icon + ".jpg'>";
}

//////////////////////////////////////////////////////////////
// MiniItemIcons: Displays item icons in the thread preview //
//////////////////////////////////////////////////////////////
function MiniItemIcons(x)
{
  var start = x.indexOf(':') + 1;
  var end   = x.indexOf('}', start);
  var icon  = x.substring(start, end);
  return "<img src='" + "http://ddragon.leagueoflegends.com/cdn/5.21.1/img/item/" + icon + ".png' width='16px' height='16px'>";
}

////////////////////////////////////////////////////////////////////////////
// MiniSummonerIcons: Displays summoner spell icons in the thread preview //
////////////////////////////////////////////////////////////////////////////
function MiniSummonerIcons(x)
{
  var start = x.indexOf(':') + 1;
  var end   = x.indexOf('}', start);
  var icon  = x.substring(start, end);

  if(icon ==  1) icon = "-16px 0px";
  if(icon ==  2) icon = "-32px 0px";
  if(icon ==  3) icon = "-64px 0px";
  if(icon ==  4) icon = "-80px 0px";
  if(icon ==  6) icon = "-96px 0px";
  if(icon ==  7) icon = "-112px 0px";
  if(icon == 11) icon = "-32px -16px";
  if(icon == 12) icon = "-48px -16px";
  if(icon == 13) icon = "-128px 0px";
  if(icon == 14) icon = "-48px 0px";
  if(icon == 17) icon = "-144px 0px";
  if(icon == 21) icon = "0px 0px";
  if(icon == 30) icon = "0px -16px";
  if(icon == 31) icon = "-16px -16px";

  if(icon == 32)
  {
    icon = "-128px -32px";
    return "<span style='background-size: 50%; background: transparent url(\"//ddragon.leagueoflegends.com/cdn/5.21.1/img/sprite/small_spell13.png\") no-repeat scroll " + icon + "; background-size: 1000%; width: 16px; height: 16px; display: inline-block;'></span>";
  }

  return "<span style='background-size: 50%; background: transparent url(\"//ddragon.leagueoflegends.com/cdn/5.21.1/img/sprite/small_spell0.png\") no-repeat scroll " + icon + "; background-size: 1000%; width: 16px; height: 16px; display: inline-block;'></span>";
}

//////////////////////////////////////////////////////////////////////
// AddToNavBar: Adds a completely new element to the navigation bar //
//////////////////////////////////////////////////////////////////////
function AddToNavBar(obj, cName, html, navBar, index)
{
  obj.className = cName;
  obj.innerHTML = html;
  navBar.insertBefore(obj, navBar.children[index]);
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// CreateNavBarGroup: Makes a container in the navigation bar to hold buttons for dropdown list //
//////////////////////////////////////////////////////////////////////////////////////////////////
function CreateNavBarGroup(obj, idName, navBar, index, width, height, lineHeight, backgroundSize)
{
  navBar.children[index].appendChild(obj);
  obj.id = idName;
  obj.style.setProperty("position",        "absolute");
  obj.style.setProperty("width",           width);
  obj.style.setProperty("height",          height);
  obj.style.setProperty("line-height",     lineHeight);
  obj.style.setProperty("background-size", backgroundSize);
  obj.style.setProperty("background-image", "url('https://cdn.leagueoflegends.com/riotbar/prod/1.5.2/images/bar/bg-bar.jpg?1435084967')");
}

//////////////////////////////////////////////////////////////////////////////////
// CreateNavBarButton: Creates buttons within a container for the dropdown list //
//////////////////////////////////////////////////////////////////////////////////
function CreateNavBarButton(navGroup, obj, text, url)
{
  navGroup.appendChild(obj);
  obj.textContent = text;
  obj.href        = url;
  obj.className   = "link";
  obj.onmousedown = function ClickOnLink(){this.style.setProperty("color", "#FFFFFF");};
  obj.style.setProperty("color", "#CFBA6B");
  obj.style.setProperty("height", "30px");
}

//////////////////////////////////////////////////////////////
// CreateNavListLink: Creates a link in the navigation list //
//////////////////////////////////////////////////////////////
function CreateNavListLink(text, url)
{
  var navList   = document.getElementById("markdown-nav").getElementsByTagName("p")[1];
  var lineBreak = document.createElement("br");
  var anchor    = document.createElement("a");

  anchor.textContent = text;
  anchor.href        = url;

  navList.insertBefore(lineBreak, navList.children[navList.childElementCount]);
  navList.insertBefore(anchor, navList.children[navList.childElementCount]);
}

function RemoveNavListLinks()
{
  var navList = document.getElementById("markdown-nav").getElementsByTagName("p")[1];

  for(var text in hide)
  {
    for(var i = 0; i < navList.children.length; ++i)
    {
      if(navList.children[i].textContent == text && hide[text] == "on")
      {
        // Remove the <br> after the navLink, if it exists
        if(navList.children[i].nextSibling)
          navList.children[i].nextSibling.remove();

        // Remove the <a href> link
        navList.children[i].remove();
      }
    }
  }
}

/////////////////////////////////////////////////////////////
// AddFEKNavBar: Adds a FEK dropdown to the navigation bar //
/////////////////////////////////////////////////////////////
function AddFEKNavBar()
{
  WaitAndRun("#riotbar-navbar", function()
  {
    $("#riotbar-navbar").append("\
    <span class='riotbar-navbar-separator'></span>\
    <a class='touchpoint-fek' href='#'>F.E.K.</a>\
    ");

    $(".touchpoint-fek").click(function(event)
    {
      event.preventDefault();
      event.stopPropagation();
      PanelToggle();
    });
  });
  return;
  var NavBarFEK      = document.createElement("li"); AddToNavBar(NavBarFEK, "touchpoint-fek", "<a href='#'>F.E.K.</a>", RiotBar, 7);
  var FEKNavBarGroup = document.createElement("li"); CreateNavBarGroup(FEKNavBarGroup, "FEKNavBarGroup", RiotBar, 7, "120px", "60px", "27px", "100% 30px");
  var FEKPanel       = document.createElement("a");  CreateNavBarButton(FEKNavBarGroup, FEKPanel,  "F.E.K. Panel",  "#"); FEKPanel.id = "FEKPanel";
  var FEKThread      = document.createElement("a");  CreateNavBarButton(FEKNavBarGroup, FEKThread, "F.E.K. Thread", FEKpage);
}

////////////////////////////////////////////////////////////////////////////
// AddBoardsNavBarNA: Adds a Boards dropdown to the navigation bar for NA //
////////////////////////////////////////////////////////////////////////////
function AddBoardsNavBarNA()
{
  var BoardsNavBarGroup        = document.createElement("li"); CreateNavBarGroup(BoardsNavBarGroup, "BoardsNavBarGroup", RiotBar, 3, "250px", "480px", "27px", "100% 30px");

  var Gameplay                 = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, Gameplay,                 "Gameplay",                     "http://boards.na.leagueoflegends.com/en/c/gameplay-balance");
  var StoryArtSound            = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, StoryArtSound,            "Story, Art, & Sound",          "http://boards.na.leagueoflegends.com/en/c/story-art");
  var Esports                  = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, Esports,                  "Esports",                      "http://boards.na.leagueoflegends.com/en/c/esports");
  var TeamRecruitment          = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, TeamRecruitment,          "Team Recruitment",             "http://boards.na.leagueoflegends.com/en/c/team-recruitment");
  var ConceptsCreations        = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, ConceptsCreations,        "Concepts & Creations",         "http://boards.na.leagueoflegends.com/en/c/skin-champion-concepts");
  var PlayerBehaviorModeration = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, PlayerBehaviorModeration, "Player Behavior & Moderation", "http://boards.na.leagueoflegends.com/en/c/player-behavior-moderation");
  var Miscellaneous            = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, Miscellaneous,            "Miscellaneous",                "http://boards.na.leagueoflegends.com/en/c/miscellaneous");
  var MemesGames               = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, MemesGames,               "Memes & Games",                "http://boards.na.leagueoflegends.com/en/c/memes");
  var Roleplay                 = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, Roleplay,                 "Roleplay",                     "http://boards.na.leagueoflegends.com/en/c/roleplaying");
  var GeneralDiscussion        = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, GeneralDiscussion,        "General Discussion",           "http://boards.na.leagueoflegends.com/en/f/mNBeEEkI");
  var DevCorner                = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, DevCorner,                "Dev Corner",                   "http://boards.na.leagueoflegends.com/en/c/developer-corner");
  var RedTracker               = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, RedTracker,               "Red Tracker",                  "http://boards.na.leagueoflegends.com/en/redtracker");
  var HelpSupport              = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, HelpSupport,              "Help & Support",               "http://boards.na.leagueoflegends.com/en/f/osqw6G4M");
  var ReportBug                = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, ReportBug,                "Report a Bug",                 "http://boards.na.leagueoflegends.com/en/c/bug-report");
  var BoardsFeedback           = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, BoardsFeedback,           "Boards Feedback",              "http://boards.na.leagueoflegends.com/en/c/site-feedback");
  var ServiceStatus            = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, ServiceStatus,            "Service Status",               "http://status.leagueoflegends.com/?en_US#na");
}

/////////////////////////////////////////////////////////////////////////////
// AddBoardsNavBarNA: Adds a Boards dropdown to the navigation bar for OCE //
/////////////////////////////////////////////////////////////////////////////
function AddBoardsNavBarOCE()
{
  var BoardsNavBarGroup     = document.createElement("li"); CreateNavBarGroup(BoardsNavBarGroup, "BoardsNavBarGroup", RiotBar, 3, "225px", "300px", "27px", "100% 30px");
  var RedTracker            = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, RedTracker,            "Red Tracker",               "http://boards.oce.leagueoflegends.com/en/redtracker");
  var Miscellaneous         = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, Miscellaneous,         "Miscellaneous",             "http://boards.oce.leagueoflegends.com/en/c/miscellaneous");
  var PlayerCreations       = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, PlayerCreations,       "Player Creations",          "http://boards.oce.leagueoflegends.com/en/c/player-creations");
  var GameplayStrategy      = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, GameplayStrategy,      "Gameplay & Strategy",       "http://boards.oce.leagueoflegends.com/en/c/gameplay-strategy");
  var Announcements         = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, Announcements,         "Announcements",             "http://boards.oce.leagueoflegends.com/en/c/announcements");
  var TheNewsHour           = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, TheNewsHour,           "The News Hour",             "http://boards.oce.leagueoflegends.com/en/c/the-news-hour");
  var TeamRecruitment       = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, TeamRecruitment,       "Team Recruitment",          "http://boards.oce.leagueoflegends.com/en/c/team-recruitment");
  var Esports               = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, Esports,               "Esports",                   "http://boards.oce.leagueoflegends.com/en/c/esports");
  var HelpSupport           = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, HelpSupport,           "Help & Support",            "http://boards.oce.leagueoflegends.com/en/f/ElA0rvVL");
  var ServiceStatus         = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, ServiceStatus,         "Service Status",            "http://status.leagueoflegends.com/?en_US#na");
}

//////////////////////////////////////////////////////////////////////////////
// AddBoardsNavBarEUW: Adds a Boards dropdown to the navigation bar for EUW //
//////////////////////////////////////////////////////////////////////////////
function AddBoardsNavBarEUW()
{
  var BoardsNavBarGroup     = document.createElement("li"); CreateNavBarGroup(BoardsNavBarGroup, "BoardsNavBarGroup", RiotBar, 3, "225px", "480px", "27px", "100% 30px");
  var RedTracker            = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, RedTracker,            "Red Tracker",               "http://boards.eune.leagueoflegends.com/en/redtracker");
  var Announcements         = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, Announcements,         "Announcements",             "http://boards.euw.leagueoflegends.com/en/c/announcements-en");
  var CommunityCreations    = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, CommunityCreations,    "Community Creations",       "http://boards.euw.leagueoflegends.com/en/c/community-creations-en");
  var CommunityEvents       = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, CommunityEvents,       "Community Events",          "http://events.euw.leagueoflegends.com/");
  var StreamsVideos         = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, StreamsVideos,         "Streams & Videos",          "http://boards.euw.leagueoflegends.com/en/c/streams-videos-en");
  var EventsTournaments     = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, EventsTournaments,     "Events & Tournaments",      "http://boards.euw.leagueoflegends.com/en/c/events-tournaments-en");
  var Esports               = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, Esports,               "Esports",                   "http://boards.euw.leagueoflegends.com/en/c/esports-en");
  var ChampionsGameplay     = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, ChampionsGameplay,     "Champions & Gameplay",      "http://boards.euw.leagueoflegends.com/en/c/champions-gameplay-en");
  var MapsModes             = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, MapsModes,             "Maps & Modes",              "http://boards.euw.leagueoflegends.com/en/c/maps-modes-en");
  var TeamRecruitment       = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, TeamRecruitment,       "Team Recruitment",          "http://boards.euw.leagueoflegends.com/en/c/team-recruitment-en");
  var PlayerBehaviour       = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, PlayerBehaviour,       "Player Behaviour",          "http://boards.euw.leagueoflegends.com/en/c/player-behaviour-en");
  var ForumGamesContests    = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, ForumGamesContests,    "Forum Games & Contests",    "http://boards.euw.leagueoflegends.com/en/c/forum-games-contests-en");
  var SuggestionsBugReports = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, SuggestionsBugReports, "Suggestions & Bug Reports", "http://boards.euw.leagueoflegends.com/en/c/suggestions-bug-reports-en");
  var OffTopic              = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, OffTopic,              "Off Topic",                 "http://boards.euw.leagueoflegends.com/en/c/off-topic-en");
  var HelpSupport           = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, HelpSupport,           "Help & Support",            "http://boards.euw.leagueoflegends.com/en/c/help-support-en");
  var ServiceStatus         = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, ServiceStatus,         "Service Status",            "http://status.leagueoflegends.com/?en_GB#euw");
}

////////////////////////////////////////////////////////////////////////////////
// AddBoardsNavBarEUNE: Adds a Boards dropdown to the navigation bar for EUNE //
////////////////////////////////////////////////////////////////////////////////
function AddBoardsNavBarEUNE()
{
  var BoardsNavBarGroup     = document.createElement("li"); CreateNavBarGroup(BoardsNavBarGroup, "BoardsNavBarGroup", RiotBar, 3, "225px", "480px", "27px", "100% 30px");
  var RedTracker            = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, RedTracker,            "Red Tracker",               "http://boards.eune.leagueoflegends.com/en/redtracker");
  var Announcements         = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, Announcements,         "Announcements",             "http://boards.eune.leagueoflegends.com/en/c/announcements-en");
  var CommunityCreations    = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, CommunityCreations,    "Community Creations",       "http://boards.eune.leagueoflegends.com/en/c/community-creations-en");
  var CommunityEvents       = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, CommunityEvents,       "Community Events",          "http://events.eune.leagueoflegends.com/");
  var StreamsVideos         = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, StreamsVideos,         "Streams & Videos",          "http://boards.eune.leagueoflegends.com/en/c/streams-videos-en");
  var EventsTournaments     = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, EventsTournaments,     "Events & Tournaments",      "http://boards.eune.leagueoflegends.com/en/c/events-tournaments-en");
  var Esports               = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, Esports,               "Esports",                   "http://boards.eune.leagueoflegends.com/en/c/esports-en");
  var ChampionsGameplay     = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, ChampionsGameplay,     "Champions & Gameplay",      "http://boards.eune.leagueoflegends.com/en/c/champions-gameplay-en");
  var MapsModes             = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, MapsModes,             "Maps & Modes",              "http://boards.eune.leagueoflegends.com/en/c/maps-modes-en");
  var TeamRecruitment       = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, TeamRecruitment,       "Team Recruitment",          "http://boards.eune.leagueoflegends.com/en/c/team-recruitment-en");
  var PlayerBehaviour       = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, PlayerBehaviour,       "Player Behaviour",          "http://boards.eune.leagueoflegends.com/en/c/player-behaviour-en");
  var ForumGamesContests    = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, ForumGamesContests,    "Forum Games & Contests",    "http://boards.eune.leagueoflegends.com/en/c/forum-games-contests-en");
  var SuggestionsBugReports = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, SuggestionsBugReports, "Suggestions & Bug Reports", "http://boards.eune.leagueoflegends.com/en/c/suggestions-bug-reports-en");
  var OffTopic              = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, OffTopic,              "Off Topic",                 "http://boards.eune.leagueoflegends.com/en/c/off-topic-en");
  var HelpSupport           = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, HelpSupport,           "Help & Support",            "http://boards.eune.leagueoflegends.com/en/c/help-support-en");
  var ServiceStatus         = document.createElement("a");  CreateNavBarButton(BoardsNavBarGroup, ServiceStatus,         "Service Status",            "http://status.leagueoflegends.com/?en_GB#eune");
}

///////////////////////////////////////////////////////////////////
// AddBoardsNavBar: Adds a Boards dropdown to the navigation bar //
///////////////////////////////////////////////////////////////////
function AddBoardsNavBar()
{
  if     (platformRegion == "na")   AddBoardsNavBarNA();
  else if(platformRegion == "oce")  AddBoardsNavBarOCE();
  else if(platformRegion == "euw")  AddBoardsNavBarEUW();
  else if(platformRegion == "eune") AddBoardsNavBarEUNE();
}

///////////////////////////////////////////////////////////////////////////////////////
// RoleplayingAlert: Creates a banner in the Roleplaying boards to notify newcomers. //
///////////////////////////////////////////////////////////////////////////////////////
function RoleplayingAlert()
{

CreateAlertBox("6px", "#003562", "#0000FF", "#FFFFFF",
               "Hello and welcome to the Roleplaying Boards! Before diving in, we ask that you familiarize yourself with the\
               <a href='http://boards.na.leagueoflegends.com/en/c/roleplaying/L4KZzEqE-community-rules-culture-and-etiquette' style='color:#00C0FF;'>Community Rules</a>,\
               and afterwards the <a href='http://boards.na.leagueoflegends.com/en/c/roleplaying/ghd7259r-guide-for-newcomers' style='color:#00C0FF;'>Guide for Newcomers</a>.\
               Another helpful thread is <a href='http://boards.na.leagueoflegends.com/en/c/roleplaying/LtW6jJgO-how-to-join-rps-and-not-get-yelled-at' style='color:#00C0FF;'>How To Join RPs</a>.\
               Please check <a href='http://boards.na.leagueoflegends.com/en/c/roleplaying/V0JcVrj0-the-ask-champion-compendium' style='color:#00C0FF;'>The Ask Champion Compendium</a> for\
               availability and details on how to play as a champion. Once you have visited these threads,\
               this notification will automatically disappear. Thank you, and enjoy your stay!");

  var url = window.location.href;
  if(url == "http://boards.na.leagueoflegends.com/en/c/roleplaying/L4KZzEqE-community-rules-culture-and-etiquette")
  {
    if(RPint === 0 || RPint == 2 || RPint == 4 || RPint == 6 || RPint == 8 || RPint == 10 || RPint == 12 || RPint == 14)
    {
      RPint = RPint + 1;
      GM_setValue("_RP", RPint);
      if(RPint == 15)
        alertBanner.remove();
    }
  }
  else if(url == "http://boards.na.leagueoflegends.com/en/c/roleplaying/ghd7259r-guide-for-newcomers")
  {
    if(RPint === 0 || RPint == 1 || RPint == 4 || RPint == 5 || RPint == 8 || RPint == 9 || RPint == 12 || RPint == 13)
    {
      RPint = RPint + 2;
      GM_setValue("_RP", RPint);
      if(RPint == 15)
        alertBanner.remove();
    }
  }
  else if(url == "http://boards.na.leagueoflegends.com/en/c/roleplaying/LtW6jJgO-how-to-join-rps-and-not-get-yelled-at")
  {
    if(RPint === 0 || RPint == 1 || RPint == 2 || RPint == 3 || RPint == 8 || RPint == 9 || RPint == 10 || RPint == 11)
    {
      RPint = RPint + 4;
      GM_setValue("_RP", RPint);
      if(RPint == 15)
        alertBanner.remove();
    }
  }
  else if(url == "http://boards.na.leagueoflegends.com/en/c/roleplaying/V0JcVrj0-the-ask-champion-compendium")
  {
    if(RPint === 0 || RPint == 1 || RPint == 2 || RPint == 3 || RPint == 4 || RPint == 5 || RPint == 6 || RPint == 7)
    {
      RPint = RPint + 8;
      GM_setValue("_RP", RPint);
      if(RPint == 15)
        alertBanner.remove();
    }
  }
}

////////////////////////////////////////
// ========== CLICK EVENTS ========== //
////////////////////////////////////////

/////////////////////////////////////////////
// When "Show More" is clicked on an index //
/////////////////////////////////////////////
$(".box.show-more").click(function(event)
{
  var timeOut = 2000, currentTime = 0;

  var oldLength = $("#discussion-list")[0].children.length;

  var interval = setInterval(function()
  {
    currentTime++;

    if(currentTime >= timeOut)
    {
      clearInterval(interval);
    }
    else
    {
      if(oldLength != $("#discussion-list")[0].children.length)
      {
        clearInterval(interval);
        HideSubboards();
        if(page == "Index" && emptyVoteReplacement != "off") EmptyVoteReplacement();
      }
    }
  }, 1);
});

////////////////////////////////////////////////
// AddPagingRight: Inefficient... merge later //
////////////////////////////////////////////////
function AddPagingRight()
{
  var currentPostCount = 0;
  $(".body-container.clearfix").each(function()
  {
    ++currentPostCount;
  });

  var timeOut = 5000, currentTime = 0;

  var interval = setInterval(function()
  {
    currentTime = currentTime + 1;

    if(currentTime >= timeOut)
    {
      clearInterval(interval);
    }
    else
    {
      var newPostCount = 0;
      $(".body-container.clearfix").each(function()
      {
        ++newPostCount;
      });

      // console.log("Checking: " + newPostCount);

      if(currentPostCount != newPostCount)
      {
        clearInterval(interval);
        LoadThread();
        AddPagingRight();
      }
    }
  }, 1);
}

/////////////////////////////////////////////////////////////////////////
// When "Show More" is clicked on Discussion View Threads within posts //
/////////////////////////////////////////////////////////////////////////
$(".paging.right").click(function(event)
{
  var currentPostCount = 0;
  $(".body-container.clearfix").each(function()
  {
    ++currentPostCount;
  });

  var timeOut = 5000, currentTime = 0;

  var interval = setInterval(function()
  {
    currentTime = currentTime + 1;

    if(currentTime >= timeOut)
    {
      clearInterval(interval);
    }
    else
    {
      var newPostCount = 0;
      $(".body-container.clearfix").each(function()
      {
        ++newPostCount;
      });

      // console.log("Checking: " + newPostCount);

      if(currentPostCount != newPostCount)
      {
        clearInterval(interval);
        LoadThread();
        AddPagingRight();
      }
    }
  }, 1);
});

//////////////////////////////////////
// Toggles the FEK panel on and off //
//////////////////////////////////////
$("#FEKPanel").click(function(event)
{
  event.preventDefault();
  event.stopPropagation();
  PanelToggle();
});

////////////////////////////////////////////////////////////////////////////
// When Quote or Reply is clicked, change the old icons to favorite icons //
////////////////////////////////////////////////////////////////////////////
$(".toggle-reply-form").click(function(event)
{
  FavoriteIcons();
});

////////////////////////////////////////
// ========== HOVER EVENTS ========== //
////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////
// Hides the dropdown menu for Boards and FEK by default, and displays them with mouse hover //
///////////////////////////////////////////////////////////////////////////////////////////////
$("#BoardsNavBarGroup").hide(); $("#FEKNavBarGroup").hide();
$(".touchpoint-boards").hover(function() {$("#BoardsNavBarGroup").show();}, function(){$("#BoardsNavBarGroup").hide();});
$(".touchpoint-fek").hover(function()    {$("#FEKNavBarGroup").show();},    function() {$("#FEKNavBarGroup").hide();});

//////////////////////////////////////////////////////////////////
// Changes the color of a link when you mouse over/away from it //
//////////////////////////////////////////////////////////////////
$(".link").hover(function()
{
  this.style.setProperty("color", "#D3C7A9");
}, function()
{
  this.style.setProperty("color", "#CFBA6B");
});

/////////////////////////////////////////////
// ========== MUTATION OBSERVER ========== //
/////////////////////////////////////////////
if(page == "Index" || page == "Thread")
{
  var target; if     (page == "Index")                             target = document.querySelector("#discussion-list");
              else if(page == "Thread" && threadMode == "Chrono")  target = document.querySelector("#comments");
              else if(page == "Thread" && threadMode == "Discuss") target = document.querySelector("#comments");

  var observer = new MutationObserver(function(mutations)
  {
    if(page == "Index")
    {
      WaitAndRun(mutations[0].addedNodes[0].children[0], LoadIndex);
    }
    else if(page == "Thread")
    {
      WaitAndRun(".riot-voting", LoadThread);
    }
  });

  var config = {attributes: true, childList: true, characterData: true};

  observer.observe(target, config);
}
