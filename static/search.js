document.querySelector('#search-results').addEventListener('click', function(e){
    
    if (e.target.matches('.upvote-button')){ 
        let user = prompt('Enter your username to record your upvote.');
        if (user===null || user===""){ }
        else{
            let my_id = e.target.parentElement.id; 
            //let my_username = e.target.parentElement.getAttribute('data-username');
            const toSend = {username: user, _id:my_id};
            const jsonString = JSON.stringify(toSend);
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', '/posts/upvotes', true);
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
    
    if (e.target.matches('.flag-button')){ 
        let message = prompt('Enter the reason for your flagging request (optional).');
        if (message===null){ } 
        else{
            let user = prompt('Enter your username to record your flagging request.');
            if (user===null || user===""){ }
            else{
                let my_id = e.target.parentElement.id; 
                //let my_username = e.target.parentElement.getAttribute('data-username');
                const toSend = {username: user, _id: my_id, flag_message: message};
                const jsonString = JSON.stringify(toSend);
                const xhr = new XMLHttpRequest();
                xhr.open('PUT', '/posts/flag', true);
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
        
    }    
})


