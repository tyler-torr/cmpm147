// project.js - Generates a dumb superhero quest to stop a supervillain from doing something
// Author: Tyler Torrella
// Date: April 7 2025

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  // create an instance of the class
  let myInstance = new MyProjectClass("value1", "value2");

  // call a method on the instance
  myInstance.myMethod();
}

// let's get this party started - uncomment me
const fillers = {
  superhero_adjective: ["The $superhero_adjective", "$superhero_adjective Prime", "Heroic", "Lovely", "Smashing", "Omega", "Super", "Enjoyable", "Home", "Savior", "Strong", "Creative", "Fast", "Delicious", "Cracked"],
  superhero_noun: ["Pencil", "$superhero_noun and $superhero_noun", "Yummerton", "Growler", "$superhero_adjective", "Chef", "name_not_found_err.404 (If you're seeing this, something went wrong in the name generation! (No I'm just kidding))", "Generic Man", "Frumpleton", "Cat", "Pluto", "Skin", "Scissors", "Paper", "Rock"],
  supervillain_adjective: ["The $supervillain_adjective", "$supervillain_adjective Gigamax", "Nefarious", "Unlovely", "Smashing", "Destructioner", "Mean", "Punching", "Homewrecker", "Super DUPER Evil", "Super Evil", "Evil", "GRRRRR!!! I'm EVIL!!!!!!", "Not So Delicious", "amgonsu"],
  supervillain_noun: ["Pencil", "$superhero_noun and $superhero_noun", "Yummerton", "Growler", "$superhero_adjective", "Chef", "name_not_found_err.404 (If you're seeing this, something went wrong in the name generation! (No I'm just kidding))", "Generic Man", "Frumpleton", "Cat", "Pluto", "Skin", "Scissors", "Paper", "Rock"],
  evil_verbing: ["tickling", "impostering", "cooking","shoving", "hiding", "grounding", "killing"],
  evil_nouns: ["dogs", "babies", "elderly people", "iHOPs", "countries", "worms", "busses", "human children", "duck children", "ducks", "clones of $superhero_adjective $superhero_noun", "帥氣"],
  superpower_verb: ["munching", "living", "verbing", "eating", "sleeping", "super DUPER kicking", "kicking", "hugging", "yelling", "punching", "tickling", "shooting"],
  superpower_noun: ["laserbeams", "me", "iHOP pancakes", "LEGOs", "pencils", "disjointed thumbs", "Coldplay CDs", "television sets", "other superheroes"],
  ending: ["- oh, wait, another superhero stopped them already", "they kill us all", "the McDonalds shuts down", "my morning jog at 8 AM", "my children die", "your powers disappear", "you lose your memories", "die! You're known for being really bad at this"],
  
};

const template = `Oh thank goodness you're here, $superhero_adjective $superhero_noun! You're the superhero needed to save the day!

You have to help us! $supervillain_adjective $supervillain_noun is wrecking havoc by $evil_verbing all of the $evil_nouns! Quick, you must go and $superpower_verb $superpower_noun to save us!

Hurry! Before $ending!
`;


// STUDENTS: You don't need to edit code below this line.

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  box.innerText = story;
}

/* global clicker */
clicker.onclick = generate;

generate();
