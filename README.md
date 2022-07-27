# Outshade-Assignment
Roadmap ● 
Two core models ○ User ○ Event 
Choice of database - mysql/mongodb. Go with mongodb. 
Model schemas - open ended from the client side. 
Probable schema from our end ○ User 
■ Title
  Metadata, - { required, enum [Mr, Miss, Mrs]}
 ■ name/fullname
 ■ Email 
   Metadata - { required, unique, valid email syntax} 
 ■ Password 
  Metadata - { required, use bcrypt } 
 ■ createdAt 
 ■ modiﬁedAt
 ■ resetPasswordToken ○ Event
 ■ name -> title 
 ■ description 
 ■ eventDate 
 ■ createdBy -> userId 
 ■ invitees [{invitee, invitedAt}] 
  Data type - array of objects ● Object structure would be { invitee: ObjectId(userId), invitedAt: timestamp  }
 ■ createdAt 
 ■ modiﬁedAt ○ Reset password requests (optional and advanced) 
 ■ userid 
 ■ Email
■ Token 
■ createdAt
■ modiﬁedAt 
  API Strategy ○ User 
■ User registration 
■ User login 
■ User logout (destroy JWT token)
■ Change password - authenticated user 
■ Reset password (token) 
■ Update password (set new password for the user) ○ Event (Protected) 
■ Create event 
■ Invite to event 
■ List events (pagination, ﬁlter - date, search, sorting) 
■ Update event (only the creator could update it) 
■ Event detail 
    Middleware Strategy based on JWT strategy ○ Authentication ○ Authorization ● Email (optional and advanced) ○ Nodemailer ○ Use a gmail test account for SMTP
    settings.
    
    
    
    
    
