// script.js
function toggleYc7Required() {
    const ycx3 = document.getElementById('ycx3').value;
    const yc7Container = document.getElementById('yc7-container');
    const yc7Input = document.getElementById('yc7');

    if (ycx3 === '0') {
        yc7Container.classList.add('active');
        yc7Input.required = true;
    } else {
        yc7Container.classList.remove('active');
        yc7Input.required = false;
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('healthForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // 验证必填字段
        const requiredFields = ['u_name', 'u_addr', 'vname', 'xq1', 'ua_choice', 'vw', 'vj', 'tw1', 'tw2', 'ycx3'];
        for (const field of requiredFields) {
            if (!data[field]) {
                alert(`错误：${field.replace('_', ' ')} 不能为空！`);
                return;
            }
        }

        // 验证校区代号
        const validCampuses = ["本人目前所在校区", "毕业班顶岗实习己离校", "坞城校区", "南中环校区", "长风校区", "榆次校区"];
        if (!validCampuses.includes(data['xq1'])) {
            alert("错误：无效的校区代号");
            return;
        }

        // 验证健康状态
        if (data['ycx3'] === '0' && !data['yc7']) {
            alert("错误：异常状态需要填写病情说明");
            return;
        }

        // 创建会话并配置请求头
        const userAgents = {
            '1': "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.56(0x18003855) NetType/WIFI Language/zh_CN",
            '2': "Mozilla/5.0 (Linux; Android 13; vivo 2000) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36"
        };

        const headers = {
            'User-Agent': userAgents[data['ua_choice']] || userAgents['2'],
            'Referer': 'http://fdcat.cn365vip.com/index.php?e=4',
            'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7'
        };

        // 登录请求
        fetch("http://fdcat.cn365vip.com/addu.php", {
            method: 'POST',
            headers: headers,
            body: new URLSearchParams({
                'u_name': data['u_name'],
                'upwd': '111111'  // 固定密码
            }),
            redirect: 'manual'
        })
            .then(response => {
                if (response.status !== 302) {
                    alert("登录失败：请检查身份证号");
                    return;
                }
                // 提交健康信息
                return fetch("http://fdcat.cn365vip.com/adddt_s2_up.php", {
                    method: 'POST',
                    headers: headers,
                    body: new URLSearchParams({
                        'u_addr': data['u_addr'],
                        'vname': data['vname'],
                        'vsex': '0',
                        'vw': data['vw'],
                        'vj': data['vj'],
                        'tw1': data['tw1'],
                        'tw2': data['tw2'],
                        'xq1': data['xq1'],
                        'yc3': '0',
                        'ycx3': data['ycx3'],
                        'yc7': data['yc7']
                    })
                });
            })
            .then(response => response.text())
            .then(text => {
                if (text.includes("数据已提交")) {
                    alert("健康打卡成功！");
                } else {
                    alert("提交失败：服务器返回异常响应");
                }
            })
            .catch(error => {
                alert(`网络错误：${error.message}`);
            });
    });
});