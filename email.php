if(!empty($_POST['subject']) &&  !empty($_POST['body']))
{
    $subject=$_POST['subject'];
    $body=$_POST['body'];
    window.open('mailto:mseddi.mohamed@iit.ens.tn?subject='.$subject.'&body='.$body);
}