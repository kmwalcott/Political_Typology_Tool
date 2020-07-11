//Event delegation for click events in my-posts tab
var old = " "; //Variable to store innerHTML for edit button

document.querySelector('#wrapper1').addEventListener('click', function(e){
    
    if (e.target.matches('.edit-button')){ 
        let my_id = e.target.parentElement.id; 
        old = e.target.parentElement.innerHTML; 
        console.log(old);
        //console.log(old.split(' '));
        let old_politician = '\''+old.split(' ')[3]+' '+old.split(' ')[4]+'\'';
        let old_state = old.split(' ')[5];
        let old_level = old.split(' ')[6]; 
        let old_question = old.split(' ')[7];
        let old_stance = old.split(' ')[8]; 
        let old_party = old.split(' ')[9]; 
        let old_video = old.split(' ')[10]; 
        let content_length = parseInt(old.split(' ')[11]);
        //console.log(content_length);
        let old_content_parsed = old.split(' ').slice(12,12+content_length);  
        //console.log(old_content_parsed);
        let old_content = old_content_parsed.join(' ');
        //console.log(old_content);
        e.target.parentElement.innerHTML = `
        <form method="POST" action="/posts/update">
                <label for="politician">Politician's Name: </label>
                <input type = "text" name="politician" id="politician" value=${old_politician} required> <br>
                <label for="state">Politician's State: </label>
                <select name="state" id="state" required>
                    <option value=" ">--Choose a state--</option>
                    <option value="Alabama" >Alabama</option>
                    <option value="Alaska" >Alaska</option>
                    <option value="Arizona" >Arizona</option>
                    <option value="Arkansas" >Arkansas</option>
                    <option value="California" >California</option>
                    <option value="Colorado" >Colorado</option>
                    <option value="Connecticut" >Connecticut</option>
                    <option value="Delaware" >Delaware</option>
                    <option value="Florida" >Florida</option>
                    <option value="Georgia" >Georgia</option>
                    <option value="Hawaii" >Hawaii</option>
                    <option value="Idaho" >Idaho</option>
                    <option value="Illinois" >Illinois</option>
                    <option value="Indiana" >Indiana</option>
                    <option value="Iowa" >Iowa</option>
                    <option value="Kansas" >Kansas</option>
                    <option value="Kentucky" >Kentucky</option>
                    <option value="Louisiana" >Louisiana</option>
                    <option value="Maine" >Maine</option>
                    <option value="Maryland" >Maryland</option>
                    <option value="Massachusetts" >Massachusetts</option>
                    <option value="Michigan" >Michigan</option>
                    <option value="Minnesota" >Minnesota</option>
                    <option value="Mississippi" >Mississippi</option>
                    <option value="Missouri" >Missouri</option>
                    <option value="Montana" >Montana</option>
                    <option value="Nebraska" >Nebraska</option>
                    <option value="Nevada" >Nevada</option>
                    <option value="New Hampshire" >New Hampshire</option>
                    <option value="New Jersey" >New Jersey</option>
                    <option value="New Mexico" >New Mexico</option>
                    <option value="New York" >New York</option>
                    <option value="North Carolina" >North Carolina</option>
                    <option value="North Dakota" >North Dakota</option>
                    <option value="Ohio" >Ohio</option>
                    <option value="Oklahoma" >Oklahoma</option>
                    <option value="Oregon">Oregon</option>
                    <option value="Pennsylvania" >Pennsylvania</option>
                    <option value="Rhode Island" >Rhode Island</option>
                    <option value="South Carolina" >South Carolina</option>
                    <option value="South Dakota" >South Dakota</option>
                    <option value="Tennessee" >Tennessee</option>
                    <option value="Texas" >Texas</option>
                    <option value="Utah">Utah</option>
                    <option value="Vermont" >Vermont</option>
                    <option value="Virginia">Virginia</option>
                    <option value="Washington">Washington</option>
                    <option value="West Virginia" >West Virginia</option>
                    <option value="Wisconsin" >Wisconsin</option>
                    <option value="Wyoming">Wyoming</option>
                </select> 
                <br> 
                <label for="party">Party: </label>
                <select name="party" id="party">
                    <option value="Republican">Republican</option>
                    <option value="Democrat">Democrat</option>
                    <option value="Libertarian">Libertarian</option>
                    <option value="Green">Green</option>
                    <option value="Independent">Independent</option>
                    <option value="Other">Other</option>
                </select>
                <label for="level">Politician's Level of Government: </label>
                <select name="level" id="level" required>
                    <option value=" ">--Choose level of government--</option>
                    <option value="Local">Local</option>
                    <option value="State">State</option>
                    <option value="Federal">Federal</option>
                </select>
                <br> 
                <label for="question">Question: </label>
                <select name="question" id="question" required>
                    <option value=" ">--Choose question--</option>
                    <option value="question1">Should the mortgage interest deduction be eliminated from the tax code?</option>
                    <option value="question2">Should states relax scope of practice laws for nurse practitioners?</option>
                    <option value="question3">Should marijuana be legal?</option>
                    <option value="question4">Should gay marriage be legal?</option>
                    <option value="question5">Should defense spending be increased or decreased?</option>
                    <option value="question6">Should the US government support a coup in Venezuela?</option>
                </select>
                <br>
                <label for="stance">Stance: </label>
                <select name="stance" id="stance" required>
                    <option value=" ">--Choose stance on question--</option>
                    <option value="lib">Libertarian</option>
                    <option value="int">Interventionist</option>
                </select>
                <br>
                <label for="video">Paste Video Embed Link Here (Optional): </label>
                <input type = "text" name="video" id="video" value=${old_video}> <br>
                <label for="content">Quote: </label>
                <textarea name="content" id="content" required>${old_content}</textarea>
                <br>
                <input type="hidden" name="_id" value=${my_id}>
                <button class="cancel-button" class="button">Cancel</button>
                <input type="submit" value="Update" class="button">
            </form>`;
            document.querySelector(`option[value=${old_party}]`).setAttribute('selected', true);
            document.querySelector(`option[value=${old_state}]`).setAttribute('selected', true);
            document.querySelector(`option[value=${old_level}]`).setAttribute('selected', true);
            document.querySelector(`option[value=${old_question}]`).setAttribute('selected', true);
            document.querySelector(`option[value=${old_stance}]`).setAttribute('selected', true);
    }

    else if (e.target.matches('.cancel-button')){
        e.target.parentElement.innerHTML = old;   
    }
    else if (e.target.matches('.delete-button')){
        let my_id = e.target.parentElement.id; 
        const toSend = {_id: my_id};
        const jsonString = JSON.stringify(toSend);
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', '/posts', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function(){
            if (this.status == 200){
                alert('Post deleted!');
            }
        }  
        xhr.send(jsonString);
        window.location.reload(); 
    }
})


document.querySelector('#wrapper2').addEventListener('click', function(e){
    if (e.target.matches('.downvote-button')){
        let user = prompt('Enter your username to remove your upvote.');
        if (user===null || user===""){ }
        else{
            let my_id = e.target.parentElement.id; 
            //let my_username = e.target.parentElement.getAttribute('data-username');
            const toSend = {username: user, _id:my_id};
            const jsonString = JSON.stringify(toSend);
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', '/posts/downvotes', true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onload = function(){
                if (this.status == 200){
                    console.log('Post was upvoted!');
                }
            }
            xhr.send(jsonString);
            window.location.reload(); 
        }
    } 
})




document.querySelector('#wrapper3').addEventListener('click', function(e){
    if (e.target.matches('.unflag-button')){
        let user = prompt('Enter your username to remove your flagging request.');
        if (user===null || user===""){ }
        else{
            let my_id = e.target.parentElement.id; 
            //let my_username = e.target.parentElement.getAttribute('data-username');
            const toSend = {username: user, _id: my_id};
            const jsonString = JSON.stringify(toSend);
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', '/posts/unflag', true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onload = function(){
                if (this.status == 200){
                    console.log('Post was upvoted!');
                }
            }
            xhr.send(jsonString);
            window.location.reload(); 
        }
    }
})
