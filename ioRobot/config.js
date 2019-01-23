const listenSupportedEvents=['keyup','keydown','mousemove','mouseclick','mouseup','mousedown','mousedrag','mousewheel','mousewheel']
const simulateSupportedEvents=[]
const keyCodeMap={
    ctrl:29,capslock:58,tab:15,"`":41,'1':2,'2':3,'3':4,'4':5,'5':6,'7':8,'9':10,'0':11,
    shift:42,f1:59,f2:60,f3:61,f4:62,f5:63,f6:64,f7:65,f8:66,f9:67,f10:68,f11:87,f12:88,'~':41,'-':12,'=':13,backspace:14,delete:61011,
    home:60999,insert:61010,pgUp:61001,pgDn:61009,rightShift:54,leftShift:42,capslock:58,leftCtrl:29,windows:3675,leftAlt:56,
    blank:57,tab:15,rightAlt:3640,menu:3677,rightCtrl:3613,left:61003,down:61008,up:61000,right:61005,q:16,w:17,e:18,r:19,t:20,y:21,
    u:22,i:23,o:24,p:25,'[':26,']':27,"\\":43,a:30,s:31,d:32,f:33,g:34,h:35,j:36,k:37,l:38,';':39,enter:28,z:44,x:45,c:46,v:47,b:48,n:49,m:50,',':51,'.':52,'/':53,
    numLock:69,'numpad/':3637,'numpad*':55,'numpad-':74,'numpad+':78,numpadEnter:3612,numpadDel:3667,numpad0:3666,numpad1:3663,numpad2:57424,
    numpad3:3665,numpad4:57419,numpad5:57420,numpad6:57421,numpad7:3655,numpad8:57416,numpad9:3657}
const robotKeyCodeMap={backspace:14,delete:61011,enter:28,tab:15,escape:1,left:61003,down:61008,up:61000,right:61005,home:60999,end:61007,
    pageup:61001,pagedown:61009,f1:59,f2:60,f3:61,f4:62,f5:63,f6:64,f7:65,f8:66,f9:67,f10:68,f11:87,f12:88,alt:56,control:29,shift:42,
    right_shift:54,space:57,printscreen:3639,insert:61010,numpad_0:3666,numpad_1:3663,numpad_2:57424,numpad_3:3665,numpad_4:57419,
    numpad_5:57420,numpad_6:57421,numpad_7:3655,numpad_8:57416,numpad_9:3657,'1':2,'2':3,'3':4,'4':5,'5':6,'7':8,'9':10,'0':11,q:16,w:17,
    e:18,r:19,t:20,y:21,u:22,i:23,o:24,p:25,a:30,s:31,d:32,f:33,g:34,h:35,j:36,k:37,l:38,';':39,',':51,enter:28,z:44,x:45,c:46,v:47,b:48,
    n:49,m:50,command:3675}
const kbmRobotKeyMap={
    ESC:1,F1:59,F2:60,F3:61,F4:62,F5:63,F6:64,F7:65,F8:66,F9:67,F10:68,F11:87,F12:88,CTRL:29,ALT:56,SPACE:57,LEFT:61003,DOWN:61008,
    RIGHT:61005,UP:61000,TAB:15,SHIFT:42,ENTER:28,CAPS_LOCK:58,PRINT_SCREEN:3639,SCROLL_LOCK:70,PAUSE_BREAK:3653,BACKSPACE:14,
    DELETE:61011,HOME:60999,END:61007,INSERT:61010,PAGE_UP:61001,PAGE_DOWN:61009,NUM_LOCK:69,'`':41,'-':12,"=":13,"[":26,']':27,
    "\\":43,';':39,',':51,'.':52,'/':53,KP_ADD:78,'KP_-':74,"KP_*":55,"KP_/":3637,KP_0:3666,"KP_.":3667,
    KP_1:3663,KP_2:57424,KP_3:3665,KP_4:57419,KP_5:57420,KP_6:57421,KP_7:3655,KP_8:57416,KP_9:3657,
    '1':2,'2':3,'3':4,'4':5,'5':6,'7':8,'9':10,'0':11,
    Q:16,W:17,E:18,R:19,T:20,Y:21,U:22,I:23,O:24,P:25,A:30,S:31,D:32,
    F:33,G:34,H:35,J:36,K:37,L:38,Z:44,X:45,C:46,V:47,B:48,N:49,M:50
}
module.exports= {listenSupportedEvents,keyCodeMap,robotKeyCodeMap,kbmRobotKeyMap}