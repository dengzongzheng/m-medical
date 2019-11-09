const categories =
    [
        {
            name:"工作动态",
            value:1
        },
        {
            name:"通知公告",
            value:2
        },
        {
            name:"法律法规",
            value:3
        },
        {
            name:"信息",
            value:4
        },
        {
            name: "监督",
            value: 5
        }
    ];
const title = "卫生监督";
const organizations = [
    {
        "organization_name": "公共机构",
        "organization_code": 1,
        "industries": [
            {
                "code": 1,
                "name": "住宿业"
            },
            {
                "code": 2,
                "name": "美容店"
            },
            {
                "code": 3,
                "name": "理发店"
            },
            {
                "code": 4,
                "name": "公共浴室"
            },
            {
                "code": 5,
                "name": "商场"
            }
        ]
    },
    {
        "organization_code": 2,
        "organization_name": "学校",
        "industries": [],
    },
    {
        "organization_code": 3,
        "organization_name": "医疗机构",
        "industries": [
            {
                "code": 1,
                "name": "传染病防控"
            },
            {
                "code": 2,
                "name": "放射卫生"
            },
            {
                "code": 3,
                "name": "依法执业"
            }
        ]
    },
    {
        "organization_code": 4,
        "organization_name": "供水单位",
        "industries": []
    },
    {
        "organization_code": 5,
        "organization_name": "监督协管",
        "industries": []
    }
];


export {categories,title,organizations};
