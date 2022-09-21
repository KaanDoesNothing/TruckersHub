<template>
    <div class="flex justify-center mt-10">
        <div class="card w-80 bg-base-100 shadow-xl m-1 text-primary-content">
            <div class="card-body">
            <h2 class="card-title">Login</h2>
            <form class="form-control" action="/auth/login" method="post">
                <label class="label"><span class="label-text">Username</span></label>
                <input class="input input-bordered w-full max-w-xs" type="text" name="username"/>
                <label class="label"><span class="label-text">Password</span></label>
                <input class="input input-bordered w-full max-w-xs" type="password" name="password"/>
                <div class="card-actions text-center mt-2">
                <button class="btn btn-ghost btn-block" type="submit">Login</button>
                </div>
            </form>
            </div>
        </div>
    </div>
</template>