<template>
    <div class="flex justify-center mt-10">
        <div class="card w-80 bg-base-100 shadow-xl m-1 text-primary-content">
            <div class="card-body">
            <h2 class="card-title">Register</h2>
            <form class="form-control" action="/auth/register" method="post">
                <label class="label"></label><span class="label-text">Username</span>
                <input class="input input-bordered w-full max-w-xs" type="text" name="username"/>
                <label class="label"></label><span class="label-text">Password</span>
                <input class="input input-bordered w-full max-w-xs" type="password" name="password"/>
                <div class="card-actions text-center mt-2"></div>
                <button class="btn btn-ghost btn-block" type="submit">Register</button>
            </form>
            </div>
        </div>
    </div>
</template>