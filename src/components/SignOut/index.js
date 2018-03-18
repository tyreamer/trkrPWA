import React from 'react';
import * as FontAwesome from 'react-icons/lib/fa'

import { auth } from '../../firebase';

const SignOutButton = () =>
    <div onClick={auth.doSignOut}>
        <FontAwesome.FaSignOut  size={30} />
    </div>


export default SignOutButton;
